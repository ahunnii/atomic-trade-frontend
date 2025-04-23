import { z } from "zod";
import { env } from "~/env";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const productRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const storeSlug = env.STORE_NAME.toLowerCase().replace(/ /g, "-");

    const products = await ctx.db.product.findMany({
      where: {
        store: { slug: storeSlug },
        status: "ACTIVE",
      },
      include: { variants: true },
    });

    return products;
  }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const product = await ctx.db.product.findUnique({
        where: { slug: input.slug },
        include: {
          attributes: true,
          variants: true,
          reviews: true,
        },
      });

      return product;
    }),
});
