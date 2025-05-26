import { api } from "~/trpc/server";
import { NotFound } from "~/app/_components/not-found";

import { ContactUsForm } from "./_components/contact-us-form";

export const metadata = {
  title: "Contact Us",
};

export default async function ContactPage() {
  const reservedPage = await api.reservedPage.getBySlug("contact-us");

  if (!reservedPage?.isEnabled) return <NotFound />;

  return (
    <div className="page-container">
      <h1 className="page-title">Contact Us</h1>

      <div className="mx-auto max-w-2xl rounded-lg border border-gray-100 bg-white p-8 shadow-sm">
        <p className="mb-6 text-center text-gray-600">
          Have a question or feedback? We&apos;d love to hear from you.
        </p>
        <ContactUsForm />
      </div>
    </div>
  );
}
