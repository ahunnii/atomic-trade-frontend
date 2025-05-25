import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const sitePageRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.string())
    .query(({ ctx, input: sitePageSlug }) => {
      return ctx.db.sitePage.findUnique({
        where: { slug: sitePageSlug },
      });
    }),
});
