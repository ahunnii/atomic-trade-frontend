import { z } from "zod";
import {
  basicInfoSchema,
  profileSchema,
} from "~/app/(site)/account/info/_validators/schema";
import { env } from "~/env";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const accountRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    const storeSlug = env.STORE_NAME.toLowerCase().replace(/ /g, "-");

    const customerProfile = await ctx.db.customer.findUnique({
      where: {
        store: { slug: storeSlug },
        email: ctx.session.user.email!,
      },
      include: { addresses: true },
    });

    return customerProfile;
  }),

  updateProfile: protectedProcedure
    .input(profileSchema)
    .mutation(async ({ ctx, input }) => {
      const customerProfile = await ctx.db.customer.update({
        where: {
          email: ctx.session.user.email!,
        },
        data: {
          ...input,
        },
      });

      return {
        data: customerProfile,
        message: "Profile updated successfully",
      };
    }),

  updateBasicInfo: protectedProcedure
    .input(basicInfoSchema)
    .mutation(async ({ ctx, input }) => {
      const customerProfile = await ctx.db.customer.update({
        where: {
          email: ctx.session.user.email!,
        },
        data: {
          ...input,
        },
      });

      return {
        data: customerProfile,
        message: "Profile updated successfully",
      };
    }),

  updateEmailNotifications: protectedProcedure
    .input(z.boolean())
    .mutation(async ({ ctx, input }) => {
      const customerProfile = await ctx.db.customer.update({
        where: { email: ctx.session.user.email! },
        data: { subscribedToEmailPromos: input },
      });

      return {
        data: customerProfile,
        message: input
          ? "You are now subscribed to email promotions"
          : "You are now unsubscribed from email promotions",
      };
    }),

  updateSmsNotifications: protectedProcedure
    .input(z.boolean())
    .mutation(async ({ ctx, input }) => {
      const customerProfile = await ctx.db.customer.update({
        where: { email: ctx.session.user.email! },
        data: { subscribedToSmsPromos: input },
      });

      return {
        data: customerProfile,
        message: input
          ? "You are now subscribed to SMS promotions"
          : "You are now unsubscribed from SMS promotions",
      };
    }),
});
