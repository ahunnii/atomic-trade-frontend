import { ContactUsForm } from "./_components/contact-us-form";

export default async function ContactPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-10 text-center text-4xl font-bold tracking-wider uppercase">
        Contact Us
      </h1>

      <div className="mx-auto max-w-2xl rounded-lg border border-gray-100 bg-white p-8 shadow-sm">
        <p className="mb-6 text-center text-gray-600">
          Have a question or feedback? We&apos;d love to hear from you.
        </p>
        <ContactUsForm />
      </div>
    </div>
  );
}
