"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

import type { Product, Variation } from "@prisma/client";

import { env } from "~/env";
import { api } from "~/trpc/react";
import { LoadButton } from "~/components/common/load-button";
import { QuantityNumberInput } from "~/components/inputs/quantity-number-input";

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
};

export function CartClient({ cart }: Props) {
  const utils = api.useUtils();
  const router = useRouter();

  const adjustQuantity = api.cart.adjustQuantity.useMutation({
    onSettled: () => {
      void utils.cart.invalidate();
      router.refresh();
    },
  });

  const deleteItem = api.cart.deleteItem.useMutation({
    onSettled: () => {
      void utils.cart.invalidate();
      router.refresh();
    },
  });

  return (
    <div className="flex w-full flex-col gap-4 p-4">
      {!cart || cart.cartItems.length === 0 ? (
        <div className="text-muted-foreground text-center">
          Your cart is empty
        </div>
      ) : (
        <>
          {cart?.cartItems.map((item) => (
            <div
              key={item.id}
              className="flex w-full items-center justify-between border-b py-4"
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
                    void adjustQuantity.mutate({
                      cartId: cart?.id ?? "",
                      variantId: item.variantId,
                      quantity: value,
                    });
                  }}
                />
                <LoadButton
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  isLoading={false}
                  loadingText=""
                  onClick={() => {
                    void deleteItem.mutate({
                      cartId: cart?.id ?? "",
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
  );
}
