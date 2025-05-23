"use client";

import { ShoppingCartIcon, X } from "lucide-react";
import Image from "next/image";

import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { env } from "~/env";
import { api } from "~/trpc/react";
import { formatCurrency } from "~/utils/format-currency";
import { LoadButton } from "../common/load-button";
import { QuantityNumberInput } from "../inputs/quantity-number-input";

import { useRouter } from "next/navigation";

type Props = {
  cartQuantity: number;
  navCartId?: string;
};

export function ShoppingCart({ navCartId, cartQuantity }: Props) {
  const utils = api.useUtils();
  const router = useRouter();

  const { data: cartItems } = api.cart.getItems.useQuery(navCartId ?? "");
  const { data: currentCart } = api.cart.get.useQuery(navCartId ?? "", {
    enabled: !!navCartId,
  });

  const { data: store } = api.store.get.useQuery();

  const adjustQuantity = api.cart.adjustQuantity.useMutation({
    onSettled: () => void utils.cart.invalidate(),
  });

  const deleteItem = api.cart.deleteItem.useMutation({
    onSettled: () => void utils.cart.invalidate(),
  });

  const currentCartTotal =
    currentCart?.cartItems.reduce(
      (total, item) => total + (item.variant.priceInCents ?? 0) * item.quantity,
      0,
    ) ?? 0;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="flex cursor-pointer items-center gap-2">
          <div className="relative">
            <ShoppingCartIcon className="h-5 w-5" />
            {(cartItems ?? cartQuantity ?? 0) > 0 && (
              <span className="bg-primary/75 absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full text-xs font-bold text-white">
                {cartItems ?? cartQuantity ?? 0}
              </span>
            )}
          </div>
        </div>
      </SheetTrigger>
      <SheetContent className="flex flex-col p-0 sm:max-w-xl">
        <SheetHeader className="px-4 pt-8 pb-2">
          <SheetTitle className="text-xl font-semibold">
            Shopping Cart
          </SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col gap-4 p-4">
            {!currentCart || currentCart.cartItems.length === 0 ? (
              <div className="text-muted-foreground text-center">
                Your cart is empty
              </div>
            ) : (
              <>
                {currentCart?.cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between border-b py-4"
                  >
                    <div className="flex items-center gap-2">
                      <div className="relative aspect-square w-16">
                        <Image
                          src={`${env.NEXT_PUBLIC_STORAGE_URL}/products/${item.variant.imageUrl ?? item.variant.product?.featuredImage ?? ""}`}
                          alt={item.variant.product?.name ?? ""}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <div className="font-medium">
                          {item?.variant?.product?.name}
                        </div>
                        <div className="text-muted-foreground text-sm">
                          {item?.variant?.name}
                        </div>
                        <div className="text-sm">
                          {item?.variant?.priceInCents && (
                            <div className="flex items-center">
                              ${(item.variant.priceInCents / 100).toFixed(2)}
                              {item?.variant?.compareAtPriceInCents && (
                                <>
                                  <span className="ml-2 line-through">
                                    $
                                    {(
                                      item.variant.compareAtPriceInCents / 100
                                    ).toFixed(2)}
                                  </span>
                                  <span className="ml-2 rounded bg-red-500 px-1.5 py-0.5 text-xs font-semibold text-white">
                                    SALE
                                  </span>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                      <QuantityNumberInput
                        defaultValue={item.quantity}
                        onChange={(value) => {
                          adjustQuantity.mutate({
                            cartId: navCartId ?? "",
                            variantId: item.variantId,
                            quantity: value,
                          });
                        }}
                      />
                      <LoadButton
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        isLoading={deleteItem.isPending}
                        loadingText=""
                        onClick={() => {
                          deleteItem.mutate({
                            cartId: navCartId ?? "",
                            variantId: item.variantId,
                          });
                        }}
                      >
                        <X className="h-4 w-4" />
                      </LoadButton>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
        {currentCart && currentCart.cartItems.length > 0 && (
          <div className="border-t p-4">
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-muted-foreground text-xs">
                    Shipping, taxes, and discounts calculated at checkout.
                  </span>
                </div>
                <span>{formatCurrency(currentCartTotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping estimate</span>
                <span>
                  {formatCurrency(
                    store?.hasFlatRate
                      ? (store?.flatRateAmount ?? 0)
                      : (store?.minFreeShipping ?? 0),
                  )}
                </span>
              </div>

              <div className="flex justify-between font-medium">
                <span>Order total</span>
                <span>
                  {formatCurrency(
                    currentCartTotal + (store?.flatRateAmount ?? 0),
                  )}
                </span>
              </div>
              <Button
                className="w-full"
                onClick={() => {
                  void router.push("/cart");
                }}
              >
                Go to cart
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
