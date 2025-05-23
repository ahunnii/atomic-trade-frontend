/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import type { InputJsonValue } from "@prisma/client/runtime/library";
import { TRPCError } from "@trpc/server";

export const sitePageRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.string())
    .query(({ ctx, input: sitePageSlug }) => {
      return ctx.db.sitePage.findUnique({
        where: { slug: sitePageSlug },
      });
    }),
});
