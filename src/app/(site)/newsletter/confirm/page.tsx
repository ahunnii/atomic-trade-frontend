import { redirect } from "next/navigation";
import { api } from "~/trpc/server";

type Props = {
  searchParams: Promise<{
    token: string;
  }>;
};

export default async function NewsletterConfirmPage({ searchParams }: Props) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="rounded-lg bg-red-50 p-8 text-center">
          <h2 className="mb-4 text-xl font-semibold text-red-800">
            Invalid Request
          </h2>
          <p className="text-red-600">
            Something went wrong. Please try subscribing again.
          </p>
        </div>
      </div>
    );
  }

  const result = await api.store.confirmNewsletterSubscription({ token });

  if (!result.data) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="rounded-lg bg-red-50 p-8 text-center">
          <h2 className="mb-4 text-xl font-semibold text-red-800">
            Subscription Error
          </h2>
          <p className="text-red-600">{result.message}</p>
        </div>
      </div>
    );
  }

  return redirect("/newsletter/thank-you");
}
