"use server";
import Link from "next/link";
import { getCartId } from "~/server/actions/cart";
import { auth } from "~/server/auth";
import { api } from "~/trpc/server";
import CheckoutClient from "./_components/checkout-client";
import { CheckoutPayment } from "./_components/checkout-payment";
import {
  CheckoutSummary,
  type DiscountedCartData,
} from "./_components/checkout-summary";

export default async function CartPage() {
  const cartId = await getCartId();
  const session = await auth();
  const cart = !cartId ? null : await api.cart.get(cartId);
  const discountedCartData = await api.store.prepCheckout({
    cartId: cartId ?? "",
  });
  const isEmpty = !cart || cart.cartItems.length === 0;

  return (
    <div className="container mx-auto min-h-[80svh] px-4 py-8">
      {isEmpty ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground text-lg">Your cart is empty</p>
          <p className="text-muted-foreground mt-2">
            Add items to your cart to see them here
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <CheckoutClient
              totalInCents={discountedCartData.totalAfterDiscounts ?? 0}
              email={session?.user?.email ?? undefined}
            />
          </div>
          <div className="md:relative">
            <div className="rounded-lg border transition-shadow duration-300 md:sticky md:top-4 md:hover:shadow-md">
              <CheckoutSummary
                discountedCartData={
                  discountedCartData as unknown as DiscountedCartData
                }
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
