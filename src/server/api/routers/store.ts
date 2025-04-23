import type { JsonObject } from "@prisma/client/runtime/library";
import { z } from "zod";
import { env } from "~/env";
import { setCartId } from "~/server/actions/cart";

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

export const storeRouter = createTRPCRouter({
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
});
