import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { contactUsSchema } from "~/app/(site)/store/contact-us/_validators/schema";
import { env } from "~/env";
import { calculateCartDiscounts } from "~/lib/discounts/calculate-cart-discounts";
import { emailService } from "~/lib/email";
import { ContactUsEmail } from "~/lib/email/email-templates/contact-us-email";
import { SpecialRequestEmail } from "~/lib/email/email-templates/special-request-email";
import { paymentService } from "~/lib/payments";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { formatNoRespondEmail } from "~/utils/format-store-emails";

export const storeRouter = createTRPCRouter({
  getBrand: publicProcedure.query(async ({ ctx }) => {
    const storeSlug = env.STORE_NAME.toLowerCase().replace(/ /g, "-");

    const store = await ctx.db.store.findUnique({
      where: { slug: storeSlug },
      select: { logo: true, name: true },
    });

    return store;
  }),

  getHomePageSettings: publicProcedure.query(async ({ ctx }) => {
    const storeSlug = env.STORE_NAME.toLowerCase().replace(/ /g, "-");

    const store = await ctx.db.store.findUnique({
      where: { slug: storeSlug },
      select: { homePageSettings: true },
    });

    return store?.homePageSettings;
  }),
  get: publicProcedure.query(async ({ ctx }) => {
    const storeSlug = env.STORE_NAME.toLowerCase().replace(/ /g, "-");

    // Find the guest cart by ID
    const store = await ctx.db.store.findUnique({
      where: { slug: storeSlug },
      select: {
        flatRateAmount: true,
        minFreeShipping: true,
        id: true,
        name: true,
        hasFreeShipping: true,
        hasFlatRate: true,
        hasPickup: true,
        pickupInstructions: true,
      },
    });

    return store;
  }),

  contactUs: publicProcedure
    .input(contactUsSchema)
    .mutation(async ({ input, ctx }) => {
      const storeSlug = env.STORE_NAME.toLowerCase().replace(/ /g, "-");

      const store = await ctx.db.store.findUnique({
        where: { slug: storeSlug },
        select: {
          publicEmail: true,
          name: true,
          contactEmail: true,
          id: true,
        },
      });

      if (!store) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Store not found",
        });
      }

      const message = await ctx.db.contactMessage.create({
        data: {
          email: input.email,
          name: input.name,
          message: input.message,
          storeId: store?.id,
        },
      });

      const noRespondEmail = formatNoRespondEmail(store.name);

      const email = await emailService.sendEmail({
        to: store.contactEmail,
        from: noRespondEmail,
        subject: `New message from ${input.email}`,
        template: ContactUsEmail,
        data: {
          name: input.name,
          email: input.email,
          message: input.message,
          storeName: store.name,
        },
      });

      return {
        data: {
          email,
          message,
        },
        message: "Email sent successfully",
      };
    }),

  submitRequest: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string(),
        message: z.string(),
        images: z.array(z.string()),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const storeSlug = env.STORE_NAME.toLowerCase().replace(/ /g, "-");

      const store = await ctx.db.store.findUnique({
        where: { slug: storeSlug },
      });
      if (!store) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Store not found",
        });
      }

      let customer = await ctx.db.customer.findUnique({
        where: { email: input.email },
      });

      customer ??= await ctx.db.customer.create({
        data: {
          email: input.email,
          firstName: input.name.split(" ")[0] ?? "",
          lastName: input.name.split(" ")[1] ?? "",
          storeId: store.id,
        },
      });

      const request = await ctx.db.productRequest.create({
        data: {
          firstName: input.name.split(" ")[0] ?? "",
          lastName: input.name.split(" ")[1] ?? "",
          email: input.email,
          details: input.message,
          storeId: store.id,
          customerId: customer.id,
          images: input.images,
          status: "PENDING",
        },
      });

      const noRespondEmail = formatNoRespondEmail(store.name);

      const email = await emailService.sendEmail({
        to: store.contactEmail,
        from: noRespondEmail,
        subject: `New special request from ${input.email}`,
        template: SpecialRequestEmail,
        data: {
          name: input.name,
          email: input.email,
          message: input.message,
          images: input.images,
          storeName: store.name,
          requestId: request.id,
          storeSlug: store.slug ?? "",
        },
      });

      return {
        data: { request, email },
        message: "Request submitted successfully",
      };
    }),

  // checkout: publicProcedure
  //   .input(checkoutSchema)
  //   .mutation(async ({ ctx, input }) => {
  //     const cart = await ctx.db.cart.findUnique({
  //       where: { id: input.cartId },
  //       include: { cartItems: true, customer: true },
  //     });

  //     if (!cart) {
  //       throw new TRPCError({ code: "NOT_FOUND", message: "Cart not found" });
  //     }

  //     const store = await ctx.db.store.findUnique({
  //       where: { id: cart.storeId },
  //       include: {
  //         discounts: {
  //           include: { collections: true, variants: true, customers: true },
  //         },
  //         collections: {
  //           include: { products: { include: { variants: true } } },
  //         },
  //       },
  //     });

  //     if (!store) {
  //       throw new TRPCError({ code: "NOT_FOUND", message: "Store not found" });
  //     }

  //     const variants = await ctx.db.variation.findMany({
  //       where: { product: { storeId: cart.storeId } },
  //       include: { product: true },
  //     });

  //     const couponDiscount = input?.couponCode
  //       ? await ctx.db.discount.findFirst({
  //           where: { storeId: cart.storeId, code: input.couponCode },
  //           include: { collections: true, variants: true, customers: true },
  //         })
  //       : null;

  //     const cartItems = cart?.cartItems.map((item) => {
  //       const variant = variants.find((v) => v.id === item.variantId);
  //       return {
  //         variantId: item.variantId,
  //         quantity: item.quantity,
  //         priceInCents: variant?.priceInCents ?? 0,
  //       };
  //     });

  //     const data = calculateCartDiscounts({
  //       cartItems,
  //       discounts: store.discounts ?? [],
  //       collections: store.collections ?? [],
  //       variants: variants.map((v) => ({
  //         variantId: v.id,
  //         priceInCents: v.priceInCents,
  //       })),
  //       shippingCost: store.flatRateAmount ?? 0,
  //       customerId: cart.customerId ?? undefined,
  //       couponDiscount: couponDiscount ?? undefined,
  //     });

  //     const checkoutSession = await paymentService.createCheckoutSession({
  //       cartId: cart.id,
  //       storeId: cart.storeId,
  //       customerId: cart.customerId ?? undefined,
  //       couponCode: input.couponCode ?? undefined,
  //     });

  //     return { data, message: "Cart discounts calculated successfully" };
  //   }),

  prepCheckout: publicProcedure
    .input(
      z.object({
        cartId: z.string(),
        couponCode: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input: { cartId, couponCode } }) => {
      const cart = await ctx.db.cart.findUnique({
        where: { id: cartId },
        include: {
          cartItems: { include: { variant: { include: { product: true } } } },
          store: {
            include: {
              discounts: {
                include: { collections: true, variants: true, customers: true },
              },
              collections: {
                include: { products: { include: { variants: true } } },
              },
            },
          },
        },
      });

      const variants = await ctx.db.variation.findMany({
        where: { product: { storeId: cart?.storeId } },
        include: { product: true },
      });

      const couponDiscount = couponCode
        ? await ctx.db.discount.findFirst({
            where: { storeId: cart?.storeId, code: couponCode },
            include: { collections: true, variants: true, customers: true },
          })
        : null;

      const data = calculateCartDiscounts({
        cartItems: cart?.cartItems ?? [],
        discounts: cart?.store?.discounts ?? [],
        collections: cart?.store?.collections ?? [],
        variants: variants.map((v) => ({
          variantId: v.id,
          priceInCents: v.priceInCents,
          compareAtPriceInCents: v.compareAtPriceInCents,
        })),
        shippingCost: cart?.store?.flatRateAmount ?? 0,
        customerId: cart?.customerId ?? undefined,
        couponDiscount: couponDiscount ?? undefined,
      });

      return {
        ...data,
        bestAutomaticDiscount: null,
        couponDiscount: null,
      };
    }),

  checkout: publicProcedure
    .input(
      z.object({
        cartId: z.string(),
        couponCode: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input: { cartId, couponCode } }) => {
      const cart = await ctx.db.cart.findUnique({
        where: { id: cartId },
        include: {
          cartItems: { include: { variant: { include: { product: true } } } },
          store: {
            include: {
              discounts: {
                include: { collections: true, variants: true, customers: true },
              },
              collections: {
                include: { products: { include: { variants: true } } },
              },
            },
          },
        },
      });

      if (!cart) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Cart not found" });
      }

      const variants = await ctx.db.variation.findMany({
        where: { product: { storeId: cart?.storeId } },
        include: { product: true },
      });

      const couponDiscount = couponCode
        ? await ctx.db.discount.findFirst({
            where: { storeId: cart?.storeId, code: couponCode },
            include: { collections: true, variants: true, customers: true },
          })
        : null;

      const data = calculateCartDiscounts({
        cartItems: cart?.cartItems ?? [],
        discounts: cart?.store?.discounts ?? [],
        collections: cart?.store?.collections ?? [],
        variants: variants.map((v) => ({
          variantId: v.id,
          priceInCents: v.priceInCents,
          compareAtPriceInCents: v.compareAtPriceInCents,
        })),
        shippingCost: cart?.store?.flatRateAmount ?? 0,
        customerId: cart?.customerId ?? undefined,
        couponDiscount: couponDiscount ?? undefined,
      });

      const checkoutSession = await paymentService.createCheckoutSession({
        cartId: cart.id,
        storeId: cart.storeId,
        customerId: cart.customerId ?? undefined,
        couponCode: couponDiscount?.code ?? undefined,
      });

      return {
        checkoutSession,
        message: "Cart discounts calculated successfully",
      };
    }),
});
