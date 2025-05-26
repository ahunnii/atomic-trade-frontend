import { redirect } from "next/navigation";
import { auth } from "~/server/auth";

import { CompletedOrder } from "@atomic-trade/payments";

import { api } from "~/trpc/server";

import { AccountLayout } from "../../_components/account-layout";

type Props = {
  params: Promise<{ orderId: string }>;
};

export const metadata = {
  title: "Order Details",
};

export default async function OrderPage({ params }: Props) {
  const { orderId } = await params;
  const session = await auth();

  const order = await api.order.get(orderId);

  if (!order || !session?.user?.id) {
    redirect("/not-found");
  }

  return (
    <AccountLayout>
      <CompletedOrder
        session_id={
          (order?.metadata as { stripeCheckoutSessionId?: string | null })
            ?.stripeCheckoutSessionId ?? null
        }
        order={order ?? null}
        backToAccount={true}
      />
    </AccountLayout>
  );
}
