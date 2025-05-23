import type { OutputData } from "@editorjs/editorjs";

import { NotFound } from "~/app/_components/not-found";
import { MarkdownView } from "~/components/shared/markdown-view";
import { api } from "~/trpc/server";

export const metadata = {
  title: "About Us",
};

export default async function AboutUsPage() {
  const reservedPage = await api.reservedPage.getBySlug("about-us");

  if (!reservedPage?.isEnabled) {
    return <NotFound />;
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-10 text-center text-4xl font-bold tracking-wider uppercase">
        About Us
      </h1>

      <div className="mx-auto max-w-2xl rounded-lg border border-gray-100 bg-white p-8 shadow-sm">
        <MarkdownView
          defaultContent={reservedPage.content as unknown as OutputData}
          className="w-full max-w-7xl"
        />
      </div>
    </div>
  );
}
