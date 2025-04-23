import { PrismaAdapter } from "@auth/prisma-adapter";
import type { Role } from "@prisma/client";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import type { Adapter } from "next-auth/adapters";
import DiscordProvider from "next-auth/providers/discord";
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

      const customerProfile = user.email
        ? await db.customer.findUnique({
            where: { email: user.email, store: { slug: storeSlug } },
          })
        : { id: null };

      if (!customerProfile && user.email) {
        await db.customer.create({
          data: {
            email: user.email,
            firstName: user.name?.split(" ")[0] ?? "New",
            lastName: user.name?.split(" ")[1] ?? "Guest",
            store: { connect: { slug: storeSlug } },
            user: { connect: { id: user.id } },
          },
        });
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
