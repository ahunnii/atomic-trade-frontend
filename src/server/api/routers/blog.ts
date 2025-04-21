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

export const blogRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const storeSlug = env.STORE_NAME.toLowerCase().replace(/ /g, "-");

    const blogPosts = await ctx.db.blogPost.findMany({
      where: {
        store: { slug: storeSlug },
        status: "PUBLISHED",
      },
    });

    return blogPosts;
  }),

  getPreviews: publicProcedure.query(async ({ ctx }) => {
    const storeSlug = env.STORE_NAME.toLowerCase().replace(/ /g, "-");

    const blogPosts = await ctx.db.blogPost.findMany({
      where: {
        store: { slug: storeSlug },
        status: "PUBLISHED",
      },
    });

    const previews = blogPosts.map((post) => {
      const blocks = (post.content as JsonObject)?.blocks;
      const paragraphBlock = (blocks as Block[])?.find(
        (block: { type: string }) => block.type === "paragraph",
      );
      const content = paragraphBlock?.data?.text
        ?.replace(/<[^>]*>/g, "")
        ?.replace(/&nbsp;/g, " ")
        ?.replace(/&amp;/g, "&")
        ?.replace(/&lt;/g, "<")
        ?.replace(/&gt;/g, ">");

      return {
        ...post,
        id: post.id,
        title: post.title,
        content: content,
      };
    });

    return previews;
  }),
});
