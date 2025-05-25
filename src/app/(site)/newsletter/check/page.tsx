import { api } from "~/trpc/server";

export const metadata = {
  title: "Newsletter - Check Status",
};

export default async function NewsletterCheckPage() {
  const newsletterStatus = await api.store.getNewsletterStatus();

  if (!newsletterStatus.subscribedToEmailNewsletter) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="rounded-lg bg-yellow-50 p-8 text-center">
          <h2 className="mb-4 text-xl font-semibold text-yellow-800">
            Not Subscribed
          </h2>
          <p className="text-yellow-600">
            You are not currently subscribed to our newsletter.
          </p>
        </div>
      </div>
    );
  }

  if (
    newsletterStatus.newsletterTokenExpires &&
    newsletterStatus.newsletterTokenExpires > new Date()
  ) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="rounded-lg bg-yellow-50 p-8 text-center">
          <h2 className="mb-4 text-xl font-semibold text-yellow-800">
            Pending Confirmation
          </h2>
          <p className="text-yellow-600">
            Please check your email to confirm your newsletter subscription.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="rounded-lg bg-green-50 p-8 text-center">
        <h2 className="mb-4 text-xl font-semibold text-green-800">
          Subscribed
        </h2>
        <p className="text-green-600">
          You are currently subscribed to our newsletter.
        </p>
      </div>
    </div>
  );
}
