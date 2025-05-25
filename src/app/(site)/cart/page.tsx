import Link from "next/link";
import { getCartId } from "~/server/actions/cart";
import { api } from "~/trpc/server";
import { CartClient } from "./_components/cart-client";
import { CartSummaryClient } from "./_components/cart-summary-client";

export const metadata = {
  title: "Cart",
};

export default async function CartPage() {
  const cartId = await getCartId();
  const cart = !cartId ? null : await api.cart.get(cartId);
  const isEmpty = !cart || cart.cartItems.length === 0;

  return (
    <div className="container mx-auto min-h-[80svh] px-4 py-8">
      <div className="flex flex-col justify-between pb-4">
        <h1 className="mb-4 text-center text-4xl font-bold">Your Cart</h1>
        <Link
          href="/collections/all-products"
          className="group relative mb-4 block text-center text-base font-medium"
        >
          <span className="relative inline-block">
            Continue Shopping
            <span className="absolute bottom-0 left-0 h-[2.5px] w-full bg-current opacity-25"></span>
            <span className="absolute bottom-0 left-0 h-[2.5px] w-0 bg-current transition-all duration-300 group-hover:w-full"></span>
          </span>
        </Link>
      </div>
      {isEmpty ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground text-lg">Your cart is empty</p>
          <p className="text-muted-foreground mt-2">
            Add items to your cart to see them here
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="rounded-lg border">
            <CartClient cart={cart} />
          </div>
          <div>
            <CartSummaryClient cart={cart} />
          </div>
        </div>
      )}
    </div>
  );
}
