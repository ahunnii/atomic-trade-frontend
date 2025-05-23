import type { OutputData } from "@editorjs/editorjs";

import { notFound } from "next/navigation";
import { MarkdownView } from "~/components/shared/markdown-view";

import { api } from "~/trpc/server";

type Props = { params: Promise<{ pageSlug: string }> };

export const generateMetadata = async ({ params }: Props) => {
  const { pageSlug } = await params;
  const post = await api.sitePage.get(pageSlug);

  if (!post) {
    return {
      title: "Page Not Found",
      description: "The requested page could not be found",
    };
  }

  return {
    title: post.title,
    description: `Read ${post.title} on our site`,
  };
};

export default async function SitePage({ params }: Props) {
  const { pageSlug } = await params;
  const post = await api.sitePage.get(pageSlug);

  if (!post) notFound();

  return (
    <article className="mx-auto w-full max-w-7xl px-4 py-8">
      <header className="mb-8">
        <h1 className="mb-4 text-4xl font-bold">{post.title}</h1>
      </header>

      <MarkdownView
        defaultContent={post.content as unknown as OutputData}
        className="w-full max-w-7xl"
      />
    </article>
  );
}
