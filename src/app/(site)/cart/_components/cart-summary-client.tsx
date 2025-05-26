import { formatCurrency } from "~/utils/format-currency";

import type { Product, Variation } from "@prisma/client";

import { api } from "~/trpc/server";

import { CheckoutSessionButton } from "./checkout-session-button";

type CartItem = {
  id: string;
  variantId: string;
  variant: Variation & { product?: Product };
  quantity: number;
};

type Cart = {
  id: string;
  cartItems: CartItem[];
};

type Props = {
  cart: Cart;
  isUpdating?: boolean;
};

export async function CartSummaryClient({ cart }: Props) {
  const currentCart = await api.cart.get(cart.id);
  const store = await api.store.get();
  const subtotal = currentCart?.cartItems.reduce(
    (total, item) => total + (item.variant.priceInCents ?? 0) * item.quantity,
    0,
  );

  if (!currentCart || currentCart?.cartItems.length === 0) {
    return null;
  }

  return (
    <div className="flex w-full flex-col gap-4 rounded-lg border p-6">
      <h2 className="text-xl font-bold">Order Summary</h2>

      <div className="flex flex-col gap-4">
        <div className="space-y-2 pt-4">
          <div className="flex justify-between">
            <div className="flex flex-col">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-muted-foreground text-xs">
                Shipping, taxes, and discounts calculated at checkout.
              </span>
            </div>
            <span>{formatCurrency(subtotal ?? 0)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shipping</span>
            <span>
              {formatCurrency(
                store?.hasFlatRate
                  ? (store?.flatRateAmount ?? 0)
                  : (store?.minFreeShipping ?? 0),
              )}
            </span>
          </div>
          <div className="mt-2 flex justify-between border-t pt-2">
            <span className="font-bold">Total</span>
            <span className="font-bold">
              {formatCurrency((subtotal ?? 0) + (store?.flatRateAmount ?? 0))}
            </span>
          </div>
        </div>

        {/* <Button asChild className="mt-4 w-full">
          <Link href="/checkout">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Proceed to Checkout
          </Link>
        </Button> */}
        <CheckoutSessionButton cartId={cart.id} />
      </div>
    </div>
  );
}
