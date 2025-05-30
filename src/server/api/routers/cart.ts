import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const cartRouter = createTRPCRouter({
  getItems: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const cart = await ctx.db.cart.findUnique({
      where: { id: input },
      include: { cartItems: true },
    });

    const totalItems =
      cart?.cartItems.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
    return totalItems;
  }),

  get: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    // Find the guest cart by ID
    const guestCart = await ctx.db.cart.findUnique({
      where: { id: input },
      include: {
        cartItems: {
          include: { variant: { include: { product: true } } },
          orderBy: { id: "asc" },
        },
      },
    });

    // If user is logged in, find their customer cart
    let customerCart = null;
    if (ctx?.session?.user?.email) {
      const customer = await ctx.db.customer.findUnique({
        where: { email: ctx.session.user.email },
      });

      if (customer) {
        customerCart = await ctx.db.cart.findUnique({
          where: { customerId: customer.id },
          include: {
            cartItems: {
              include: { variant: { include: { product: true } } },
              orderBy: { id: "asc" },
            },
          },
        });
      }
    }

    // If no customer cart exists, just return the guest cart
    if (!customerCart) {
      return guestCart;
    }

    // If guest cart ID matches customer cart ID, they're the same cart
    if (guestCart?.id === customerCart.id) {
      return customerCart;
    }

    // Merge the carts if they're different
    if (guestCart && customerCart) {
      // Add guest cart items to customer cart
      for (const item of guestCart.cartItems) {
        // Check if item already exists in customer cart
        const existingItem = customerCart.cartItems.find(
          (cartItem) => cartItem.variantId === item.variantId,
        );

        if (existingItem) {
          // Update quantity if item exists
          await ctx.db.cartItem.update({
            where: { id: existingItem.id },
            data: { quantity: existingItem.quantity + item.quantity },
          });
        } else {
          // Add new item to customer cart
          await ctx.db.cartItem.create({
            data: {
              cartId: customerCart.id,
              variantId: item.variantId,
              quantity: item.quantity,
            },
          });
        }
      }

      // Delete the guest cart
      await ctx.db.cart.delete({
        where: { id: guestCart.id },
      });

      // Get the updated customer cart
      const updatedCart = await ctx.db.cart.findUnique({
        where: { id: customerCart.id },
        include: {
          cartItems: {
            include: { variant: { include: { product: true } } },
            orderBy: { id: "asc" },
          },
        },
      });

      return updatedCart;
    }

    // Fallback to return whatever cart exists
    return customerCart || guestCart;
  }),

  update: publicProcedure
    .input(
      z.object({
        cartId: z.string(),
        variantId: z.string(),
        quantity: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { cartId, variantId, quantity } = input;

      const cart = await ctx.db.cart.findUnique({
        where: { id: cartId },
        include: { cartItems: true },
      });

      if (!cart) {
        return {
          data: null,
          message: "Cart not found",
        };
      }

      const cartItem = cart.cartItems.find(
        (item) => item.variantId === variantId,
      );

      if (cartItem) {
        if (quantity === 0) {
          // Remove cart item if quantity is 0
          await ctx.db.cartItem.delete({
            where: { id: cartItem.id },
          });

          return {
            data: null,
            message: "Cart item removed successfully",
          };
        } else {
          // Update existing cart item
          const updatedItem = await ctx.db.cartItem.update({
            where: { id: cartItem.id },
            data: { quantity: cartItem.quantity + quantity },
          });

          return {
            data: updatedItem,
            message: "Cart item updated successfully",
          };
        }
      } else {
        // Don't create new item if quantity is 0
        if (quantity === 0) {
          return {
            data: null,
            message: "No cart item to remove",
          };
        }

        // Create new cart item
        const newItem = await ctx.db.cartItem.create({
          data: {
            cartId: cart.id,
            variantId,
            quantity,
          },
        });

        return {
          data: newItem,
          message: "Cart item created successfully",
        };
      }
    }),

  adjustQuantity: publicProcedure
    .input(
      z.object({
        cartId: z.string(),
        variantId: z.string(),
        quantity: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { cartId, variantId, quantity } = input;

      const cart = await ctx.db.cart.findUnique({
        where: { id: cartId },
        select: {
          cartItems: {
            select: {
              id: true,
              variantId: true,
              quantity: true,
            },
          },
        },
      });

      if (!cart) {
        return {
          data: null,
          message: "Cart not found",
        };
      }

      const cartItem = cart.cartItems.find(
        (item) => item.variantId === variantId,
      );

      if (!cartItem) {
        return {
          data: null,
          message: "Cart item not found",
        };
      }

      if (quantity === 0) {
        // Remove cart item if quantity is 0
        await ctx.db.cartItem.delete({
          where: { id: cartItem.id },
        });

        return {
          data: null,
          message: "Cart item removed successfully",
        };
      } else {
        // Update quantity if not zero
        const updatedItem = await ctx.db.cartItem.update({
          where: { id: cartItem.id },
          data: { quantity },
        });

        return {
          data: updatedItem,
          message: "Cart item updated successfully",
        };
      }
    }),

  deleteItem: publicProcedure
    .input(z.object({ cartId: z.string(), variantId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { cartId, variantId } = input;

      const cart = await ctx.db.cart.findUnique({
        where: { id: cartId },
        include: { cartItems: true },
      });

      if (!cart) {
        return {
          data: null,
          message: "Cart not found",
        };
      }

      const cartItem = cart.cartItems.find(
        (item) => item.variantId === variantId,
      );

      if (!cartItem) {
        return {
          data: null,
          message: "Cart item not found",
        };
      }

      await ctx.db.cartItem.delete({
        where: { id: cartItem.id },
      });

      return {
        data: null,
        message: "Cart item removed successfully",
      };
    }),
});
