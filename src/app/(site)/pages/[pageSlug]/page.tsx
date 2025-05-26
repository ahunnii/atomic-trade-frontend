import type { OutputData } from "@editorjs/editorjs";

import { api } from "~/trpc/server";
import { MarkdownView } from "~/components/shared/markdown-view";
import { NotFound } from "~/app/_components/not-found";

type Props = { params: Promise<{ pageSlug: string }> };

export const generateMetadata = async ({ params }: Props) => {
  const { pageSlug } = await params;
  const post = await api.sitePage.getPreview(pageSlug);

  return { title: post?.title ?? "Page Not Found" };
};

export default async function SitePage({ params }: Props) {
  const { pageSlug } = await params;
  const post = await api.sitePage.get(pageSlug);

  if (!post) return <NotFound />;

  return (
    <div className="page-container">
      <h1 className="page-title">{post.title}</h1>

      <MarkdownView
        defaultContent={post.content as unknown as OutputData}
        className="mx-auto w-full max-w-5xl"
      />
    </div>
  );
}
