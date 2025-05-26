import type { OutputData } from "@editorjs/editorjs";

import { api } from "~/trpc/server";
import { MarkdownView } from "~/components/shared/markdown-view";
import { NotFound } from "~/app/_components/not-found";

type Props = { params: Promise<{ policySlug: string }> };

export const generateMetadata = async ({ params }: Props) => {
  const { policySlug } = await params;
  const policy = await api.policies.getBySlug(policySlug);

  return { title: policy?.title ?? "404 Not Found" };
};

export default async function PoliciesPage({ params }: Props) {
  const { policySlug } = await params;
  const policy = await api.policies.getBySlug(policySlug);

  if (!policy) return <NotFound />;

  return (
    <div className="page-container">
      <h1 className="page-title">{policy.title}</h1>

      <MarkdownView
        defaultContent={policy.content as unknown as OutputData}
        className="mx-auto w-full max-w-5xl"
      />
    </div>
  );
}
