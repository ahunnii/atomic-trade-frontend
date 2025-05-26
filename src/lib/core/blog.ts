import type { BlogPost } from "@prisma/client";
import type { JsonObject } from "@prisma/client/runtime/library";

type Block = {
  id?: string;
  type: string;
  data: {
    text: string;
    level?: number;
  };
};

export const generateBlogPreview = (blogPost: Partial<BlogPost>) => {
  const blocks = (blogPost.content as JsonObject)?.blocks;
  const paragraphBlock = (blocks as Block[])?.find(
    (block: { type: string }) => block.type === "paragraph",
  );
  const contentText = paragraphBlock?.data?.text
    ?.replace(/<[^>]*>/g, "")
    ?.replace(/&nbsp;/g, " ")
    ?.replace(/&amp;/g, "&")
    ?.replace(/&lt;/g, "<")
    ?.replace(/&gt;/g, ">");

  return {
    id: blogPost.id!,
    title: blogPost.title!,
    content: contentText,
    slug: blogPost.slug!,
    cover: blogPost.cover!,
  };
};
