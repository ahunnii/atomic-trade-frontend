import { z } from "zod";
import { env } from "~/env";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const collectionRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const storeSlug = env.STORE_NAME.toLowerCase().replace(/ /g, "-");

    const collections = await ctx.db.collection.findMany({
      where: {
        store: { slug: storeSlug },
        status: "ACTIVE",
      },
      include: {
        products: { include: { variants: true } },
      },
    });

    return collections;
  }),
});
