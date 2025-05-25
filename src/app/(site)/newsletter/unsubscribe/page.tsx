import { api } from "~/trpc/server";

export const metadata = {
  title: "Newsletter - Unsubscribe",
};

type Props = {
  searchParams: Promise<{
    email: string;
  }>;
};

export default async function NewsletterUnsubscribePage({
  searchParams,
}: Props) {
  const { email } = await searchParams;

  const unsubscribeFromNewsletterMutation =
    await api.store.unsubscribeFromNewsletter({ email });

  if (!unsubscribeFromNewsletterMutation.data) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="rounded-lg bg-red-50 p-8 text-center">
          <h2 className="mb-4 text-xl font-semibold text-red-800">
            Error Unsubscribing
          </h2>
          <p className="text-red-600">
            We encountered an error while trying to unsubscribe you. Please try
            again later or contact support if the problem persists.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="rounded-lg bg-red-50 p-8 text-center">
        <h2 className="mb-4 text-xl font-semibold text-red-800">
          Unsubscribe from Newsletter
        </h2>
        <p className="text-red-600">
          You have been successfully unsubscribed from our newsletter.
          We&apos;re sorry to see you go!
        </p>
      </div>
    </div>
  );
}
