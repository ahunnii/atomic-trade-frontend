import { emailService } from "@atomic-trade/email";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { contactUsSchema } from "~/app/(site)/store/contact-us/_validators/schema";
import { env } from "~/env";
import { calculateCartDiscounts } from "~/lib/discounts/calculate-cart-discounts";
import { NewsletterSignUpEmail } from "~/lib/email-templates/newsletter-sign-up-email";
// import { emailService } from "~/lib/email";
// import { ContactUsEmail } from "~/lib/email/email-templates/contact-us-email";
// import { NewsletterConfirmedEmail } from "~/lib/email/email-templates/newsletter-confirmed-email";
// import { NewsletterSignUpEmail } from "~/lib/email/email-templates/newsletter-sign-up-email";
// import { NewsletterUnsubscribedEmail } from "~/lib/email/email-templates/newsletter-unsubscribed-email";
// import { SpecialRequestEmail } from "~/lib/email/email-templates/special-request-email";
import { ContactUsEmail } from "~/lib/email-templates/contact-us-email";
import { NewsletterConfirmedEmail } from "~/lib/email-templates/newsletter-confirmed-email";
import { NewsletterUnsubscribedEmail } from "~/lib/email-templates/newsletter-unsubscribed-email";
import { SpecialRequestEmail } from "~/lib/email-templates/special-request-email";
import { paymentService } from "~/lib/payments";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
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

  subscribeToNewsletter: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      const { email } = input;

      const storeSlug = env.STORE_NAME.toLowerCase().replace(/ /g, "-");

      const store = await ctx.db.store.findUnique({
        where: { slug: storeSlug },
      });

      if (!store) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Store not found" });
      }

      const token = crypto.randomUUID();
      const expires = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24h expiration
      const noRespondEmail = formatNoRespondEmail(store.name);

      await ctx.db.customer.upsert({
        where: { email },
        update: {
          newsletterToken: token,
          newsletterTokenExpires: expires,
          subscribedToEmailNewsletter: false,
          newsletterConfirmed: false,
        },
        create: {
          email,
          newsletterToken: token,
          newsletterTokenExpires: expires,
          subscribedToEmailNewsletter: false,
          newsletterConfirmed: false,
          storeId: store.id,
          firstName: "Guest",
          lastName: "",
        },
      });

      const confirmUrl = `${env.NEXT_PUBLIC_HOSTNAME}/newsletter/confirm?token=${token}`;

      await emailService.sendEmail({
        to: email,
        from: noRespondEmail,
        subject: `Confirm your subscription`,
        template: NewsletterSignUpEmail,
        data: {
          logoUrl: store.logo ?? "",
          email: input.email,
          storeName: store.name,
          previewText: "Confirm your subscription",
          confirmUrl,
        },
      });

      return {
        data: true,
        message: "Please check your email to confirm your subscription",
      };
    }),

  confirmNewsletterSubscription: publicProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { token } = input;

      const storeSlug = env.STORE_NAME.toLowerCase().replace(/ /g, "-");

      const store = await ctx.db.store.findUnique({
        where: { slug: storeSlug },
      });

      if (!store) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Store not found" });
      }

      const noRespondEmail = formatNoRespondEmail(store.name);

      const customer = await ctx.db.customer.findFirst({
        where: {
          newsletterToken: token,
          newsletterTokenExpires: { gte: new Date() },
        },
      });

      if (!customer) {
        return {
          data: false,
          message:
            "Token invalid or expired. Please sign up again in order to confirm your subscription.",
        };
      }

      await ctx.db.customer.update({
        where: { id: customer.id },
        data: {
          newsletterConfirmed: true,
          newsletterToken: null,
          newsletterTokenExpires: null,
          subscribedToEmailNewsletter: true,
        },
      });

      const unsubscribeUrl = `${env.NEXT_PUBLIC_HOSTNAME}/newsletter/unsubscribe?email=${customer.email}`;

      await emailService.sendEmail({
        to: customer.email,
        from: noRespondEmail,
        subject: `Welcome to the ${store.name} community!`,
        template: NewsletterConfirmedEmail,
        data: {
          logoUrl: store.logo ?? "",
          email: customer.email,
          storeName: store.name,
          previewText: "Welcome to the community!",
          unsubscribeUrl,
        },
      });

      return { data: true, message: "Newsletter subscription confirmed" };
    }),

  unsubscribeFromNewsletter: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      const { email } = input;

      const storeSlug = env.STORE_NAME.toLowerCase().replace(/ /g, "-");

      const store = await ctx.db.store.findUnique({
        where: { slug: storeSlug },
      });

      if (!store) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Store not found" });
      }

      const noRespondEmail = formatNoRespondEmail(store.name);

      const customer = await ctx.db.customer.findFirst({
        where: { email },
      });

      if (!customer) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Customer not found",
        });
      }

      await ctx.db.customer.update({
        where: { id: customer.id },
        data: {
          subscribedToEmailNewsletter: false,
          newsletterConfirmed: false,
          newsletterToken: null,
          newsletterTokenExpires: null,
        },
      });

      await emailService.sendEmail({
        to: customer.email,
        from: noRespondEmail,
        subject: `You've been unsubscribed from ${store.name}'s newsletter`,
        template: NewsletterUnsubscribedEmail,
        data: {
          logoUrl: store.logo ?? "",
          email: customer.email,
          storeName: store.name,
        },
      });

      return { data: true, message: "Newsletter subscription unsubscribed" };
    }),

  getNewsletterStatus: protectedProcedure.query(async ({ ctx }) => {
    const email = ctx.session.user.email;
    const storeSlug = env.STORE_NAME.toLowerCase().replace(/ /g, "-");

    if (!email) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Unauthorized",
      });
    }

    const store = await ctx.db.store.findUnique({
      where: { slug: storeSlug },
    });

    if (!store) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Store not found",
      });
    }

    const customer = await ctx.db.customer.findFirst({
      where: { email, storeId: store?.id },
      select: {
        subscribedToEmailNewsletter: true,
        newsletterConfirmed: true,

        newsletterTokenExpires: true,
      },
    });

    return {
      subscribedToEmailNewsletter: customer?.subscribedToEmailNewsletter,
      newsletterConfirmed: customer?.newsletterConfirmed,
      newsletterTokenExpires: customer?.newsletterTokenExpires,
    };
  }),
});
