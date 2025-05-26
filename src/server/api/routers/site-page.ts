import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const sitePageRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input: sitePageSlug }) => {
      const sitePage = await ctx.db.sitePage.findUnique({
        where: { slug: sitePageSlug },
      });

      if (!sitePage) {
        return null;
      }

      return sitePage;
    }),

  getPreview: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input: sitePageSlug }) => {
      const sitePage = await ctx.db.sitePage.findUnique({
        where: { slug: sitePageSlug },
        select: {
          id: true,
          title: true,
          slug: true,
        },
      });

      if (!sitePage) {
        return null;
      }

      return sitePage;
    }),
});
