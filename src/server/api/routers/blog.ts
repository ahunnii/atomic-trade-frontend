import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

import { TRPCError } from "@trpc/server";

import { env } from "~/env";
import { generateBlogPreview } from "~/lib/core/blog";

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

  getAllPreviews: publicProcedure.query(async ({ ctx }) => {
    const storeSlug = env.STORE_NAME.toLowerCase().replace(/ /g, "-");

    const blogPosts = await ctx.db.blogPost.findMany({
      where: { store: { slug: storeSlug }, status: "PUBLISHED" },
    });

    const previews = blogPosts.map(generateBlogPreview);

    return previews;
  }),

  get: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const blogPost = await ctx.db.blogPost.findUnique({
        where: { slug: input.slug },
      });

      return blogPost;
    }),

  getPreview: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input: blogSlug }) => {
      const blogPost = await ctx.db.blogPost.findUnique({
        where: { slug: blogSlug, status: "PUBLISHED" },
        select: {
          id: true,
          title: true,
          slug: true,
          content: true,
          cover: true,
        },
      });
      if (!blogPost)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Blog post not found",
        });

      const preview = generateBlogPreview(blogPost);

      return preview;
    }),
});
