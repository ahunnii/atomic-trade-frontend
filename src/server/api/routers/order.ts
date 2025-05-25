import { z } from "zod";
import { env } from "~/env";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const orderRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session?.user?.email) {
      throw new Error("User not found");
    }

    const storeSlug = env.STORE_NAME.toLowerCase().replace(/ /g, "-");

    const orders = await ctx.db.order.findMany({
      where: {
        store: { slug: storeSlug },
        email: ctx.session?.user?.email,
      },
    });

    return orders;
  }),
  get: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const customer = await ctx.db.customer.findFirst({
      where: { userId: ctx.session.user.id },
    });

    const order = await ctx.db.order.findUnique({
      where: {
        store: { slug: env.STORE_NAME.toLowerCase().replace(/ /g, "-") },
        customerId: customer?.id,
        id: input,
      },
      include: { fulfillment: true },
    });

    return order;
  }),
});
