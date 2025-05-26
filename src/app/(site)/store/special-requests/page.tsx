import { api } from "~/trpc/server";
import { NotFound } from "~/app/_components/not-found";

import { SpecialRequestForm } from "./_components/special-request-form";

export const metadata = { title: "Special Requests" };

export default async function SpecialRequestsPage() {
  const reservedPage = await api.reservedPage.getBySlug("special-requests");

  if (!reservedPage?.isEnabled) return <NotFound />;

  return (
    <div className="page-container">
      <h1 className="page-title">Special Requests</h1>

      <div className="mx-auto max-w-2xl rounded-lg border border-gray-100 bg-white p-8 shadow-sm">
        <p className="mb-6 text-center text-gray-600">
          Have a special request? We&apos;d love to hear from you.
        </p>
        <SpecialRequestForm />
      </div>
    </div>
  );
}
