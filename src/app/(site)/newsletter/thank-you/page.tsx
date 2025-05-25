export const metadata = {
  title: "Newsletter - Thank You",
};

export default async function NewsletterThankYouPage() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="rounded-lg bg-green-50 p-8 text-center">
        <h2 className="mb-4 text-xl font-semibold text-green-800">
          Subscription Confirmed!
        </h2>
        <p className="text-green-600">
          Thank you for subscribing to our newsletter! We&apos;re excited to
          share our latest updates with you.
        </p>
      </div>
    </div>
  );
}
