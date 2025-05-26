import type { OutputData } from "@editorjs/editorjs";

import { api } from "~/trpc/server";
import { MarkdownView } from "~/components/shared/markdown-view";
import { NotFound } from "~/app/_components/not-found";

export const metadata = { title: "Frequently Asked Questions" };

export default async function FrequentlyAskedQuestionsPage() {
  const reservedPage = await api.reservedPage.getBySlug(
    "frequently-asked-questions",
  );

  if (!reservedPage?.isEnabled) return <NotFound />;

  return (
    <div className="page-container">
      <h1 className="page-title">Frequently Asked Questions</h1>

      <MarkdownView
        defaultContent={reservedPage.content as unknown as OutputData}
        className="mx-auto w-full max-w-5xl"
      />
    </div>
  );
}
