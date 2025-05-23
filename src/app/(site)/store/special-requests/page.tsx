import { NotFound } from "~/app/_components/not-found";
import { api } from "~/trpc/server";
import { SpecialRequestForm } from "./_components/special-request-form";

export const metadata = {
  title: "Special Requests",
};

export default async function SpecialRequestsPage() {
  const reservedPage = await api.reservedPage.getBySlug("special-requests");

  if (!reservedPage?.isEnabled) {
    return <NotFound />;
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-10 text-center text-4xl font-bold tracking-wider uppercase">
        Special Requests
      </h1>

      <div className="mx-auto max-w-2xl rounded-lg border border-gray-100 bg-white p-8 shadow-sm">
        <p className="mb-6 text-center text-gray-600">
          Have a special request? We&apos;d love to hear from you.
        </p>
        <SpecialRequestForm />
      </div>
    </div>
  );
}
