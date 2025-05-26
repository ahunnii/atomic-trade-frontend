import Link from "next/link";
import { redirect } from "next/navigation";
import { clearCartId, getCartId } from "~/server/actions/cart";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

import type { StoreOrder } from "@atomic-trade/payments";
import { CompletedOrder } from "@atomic-trade/payments";

type Props = { searchParams: Promise<{ session_id?: string }> };

export const metadata = { title: "Order Success" };

export default async function SuccessPage({ searchParams }: Props) {
  const { session_id } = await searchParams;

  const session = await auth();

  if (!session_id) {
    if (session?.user?.id) redirect("/account/orders");
    else redirect("/auth/sign-in?callbackUrl=/account/orders");
  }

  const order = await db.order.findFirst({
    where: {
      metadata: {
        equals: {
          stripeCheckoutSessionId: session_id,
        },
      },
    },
    include: {
      fulfillment: true,
      shippingAddress: true,
      billingAddress: true,
      customer: true,
      orderItems: true,
    },
  });

  const handleCartCleanup = async () => {
    const cartId = await getCartId();
    if (cartId) {
      await db.cartItem.deleteMany({
        where: { cartId: cartId },
      });
    }
  };

  return (
    <div className="page-container">
      <div className="flex flex-col items-center justify-center space-y-6">
        <CompletedOrder
          session_id={session_id ?? ""}
          order={(order as unknown as StoreOrder) ?? null}
          handleCartCleanup={handleCartCleanup}
        />
        <Link
          href="/collections/all-products"
          className="group relative mt-8 block text-center text-base font-medium"
        >
          <span className="relative inline-block">
            Continue Shopping
            <span className="absolute bottom-0 left-0 h-[2.5px] w-full bg-current opacity-25"></span>
            <span className="absolute bottom-0 left-0 h-[2.5px] w-0 bg-current transition-all duration-300 group-hover:w-full"></span>
          </span>
        </Link>
      </div>
    </div>
  );
}
