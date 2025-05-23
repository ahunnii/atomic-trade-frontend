import type { JsonObject } from "@prisma/client/runtime/library";
import { z } from "zod";
import { env } from "~/env";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

type Block = {
  id?: string;
  type: string;
  data: {
    text: string;
    level?: number;
  };
};

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
        // customer: {
        //   email: ctx.session?.user?.email,
        // },
      },
    });

    return orders;
  }),
});
