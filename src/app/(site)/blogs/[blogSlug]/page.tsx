import type { OutputData } from "@editorjs/editorjs";
import { format } from "date-fns";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MarkdownView } from "~/components/shared/markdown-view";
import { env } from "~/env";
import { api } from "~/trpc/server";

interface BlogPageProps {
  params: Promise<{
    blogSlug: string;
  }>;
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { blogSlug } = await params;
  const post = await api.blog.get({ slug: blogSlug });

  if (!post) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-4xl px-4 py-8">
      {/* Blog Header */}
      <header className="mb-8">
        <h1 className="mb-4 text-4xl font-bold">{post.title}</h1>
        <div className="mb-4 text-gray-600">
          Published on{" "}
          {format(post.publishedAt || post.createdAt, "MMMM d, yyyy")}
        </div>
        {post.tags.length > 0 && (
          <div className="mb-6 flex gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Cover Image */}
      {post.cover && (
        <div className="relative mb-8 h-[400px] w-full overflow-hidden rounded-lg">
          <Image
            src={`${env.NEXT_PUBLIC_STORAGE_URL}/misc/${post.cover}`}
            alt={`Cover image for ${post.title}`}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Blog Content */}
      <div className="mx-auto flex w-full max-w-7xl items-center justify-center">
        {/* Render your blog content here based on the Json content field */}
        {/* This will depend on how you structure your content */}
        <MarkdownView defaultContent={post.content as unknown as OutputData} />
      </div>
    </article>
  );
}
