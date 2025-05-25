import { PrismaAdapter } from "@auth/prisma-adapter";
import type { Role } from "@prisma/client";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import type { Adapter } from "next-auth/adapters";
import DiscordProvider from "next-auth/providers/discord";
import { cookies } from "next/headers";
import { env } from "~/env";
import { db } from "~/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      role: Role;
    } & DefaultSession["user"];
  }

  interface User {
    // ...other properties
    role: Role;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [
    DiscordProvider,
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  adapter: PrismaAdapter(db) as Adapter,
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
        role: user.role,
      },
    }),

    signIn: async ({ user }) => {
      const storeSlug = env.STORE_NAME.toLowerCase().replace(/ /g, "-");

      const store = await db.store.findFirst({
        where: { slug: storeSlug },
      });

      if (!store) {
        throw new Error("Store not set up yet.");
      }

      const email = user.email;

      if (!email) return false;

      const cookieStore = await cookies();
      const guestCartId = cookieStore.get("cartId")?.value ?? null;

      // Find or create Customer record
      let customer = await db.customer.findFirst({
        where: { email },
      });

      customer ??= await db.customer.create({
        data: {
          email,
          firstName: user.name?.split(" ")[0] ?? "",
          lastName: user.name?.split(" ").slice(1).join(" ") ?? "",
          userId: user.id,
          storeId: store.id,
        },
      });

      // Merge guest cart if exists
      if (guestCartId) {
        const guestCart = await db.cart.findUnique({
          where: { id: guestCartId },
          include: { cartItems: true },
        });

        let customerCart = await db.cart.findFirst({
          where: { customerId: customer.id },
          include: { cartItems: true },
        });

        customerCart ??= await db.cart.create({
          data: { customerId: customer.id, storeId: store.id },
          include: { cartItems: true },
        });

        if (guestCart) {
          for (const item of guestCart.cartItems) {
            const existingItem = customerCart?.cartItems.find(
              (i) => i.variantId === item.variantId,
            );

            if (existingItem) {
              await db.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + item.quantity },
              });
            } else {
              await db.cartItem.create({
                data: {
                  cartId: customerCart.id,
                  variantId: item.variantId,
                  quantity: item.quantity,
                },
              });
            }
          }

          // Delete guest cart
          await db.cart.delete({ where: { id: guestCartId } });
        }

        // Overwrite cookie with customer cart ID
        cookieStore.set("cartId", customerCart.id, {
          httpOnly: true,
          path: "/",
          maxAge: 60 * 60 * 24 * 30,
          sameSite: "lax",
        });
      }

      // const customerProfile = user.email
      //   ? await db.customer.findUnique({
      //       where: { email: user.email, store: { slug: storeSlug } },
      //     })
      //   : { id: null };

      // if (!customerProfile && user.email) {
      //   await db.customer.create({
      //     data: {
      //       email: user.email,
      //       firstName: user.name?.split(" ")[0] ?? "New",
      //       lastName: user.name?.split(" ")[1] ?? "Guest",
      //       store: { connect: { slug: storeSlug } },
      //       user: { connect: { id: user.id } },
      //     },
      //   });
      // }

      // const cart = await db.cart.findFirst({
      //   where: {
      //     customer: { email: user.email! },
      //     store: { slug: storeSlug },
      //   },
      // });

      return true;
    },
  },
  pages: {
    signIn: "/auth/sign-in",
    signOut: "/auth/sign-out",
  },
} satisfies NextAuthConfig;
