import { redirect } from "next/navigation";
import { CompletedOrder } from "~/lib/payments/components/completed-order";
import { auth } from "~/server/auth";
import { api } from "~/trpc/server";

type Props = {
  params: Promise<{ orderId: string }>;
};

export default async function OrderPage({ params }: Props) {
  const { orderId } = await params;
  const session = await auth();

  const order = await api.order.get(orderId);

  if (!order || !session?.user?.id) {
    redirect("/not-found");
  }

  return (
    <div className="container mx-auto min-h-[80svh] px-4 py-8">
      <div className="flex flex-col items-center justify-center space-y-6">
        <CompletedOrder
          session_id={
            (order?.metadata as { stripeCheckoutSessionId?: string | null })
              ?.stripeCheckoutSessionId ?? null
          }
          orderId={order?.id ?? null}
          backToAccount={true}
        />
      </div>
    </div>
  );
}
