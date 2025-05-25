"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { LoadButton } from "~/components/common/load-button";

import { getCartId } from "~/server/actions/cart";
import { api } from "~/trpc/react";

export function AddToCartButton(props: {
  quantity?: number;
  variantId?: string;
}) {
  const apiUtils = api.useUtils();

  const addToCart = api.cart.update.useMutation({
    onSettled: () => {
      void apiUtils.cart.invalidate();
    },
  });
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function handleAddToCart() {
    startTransition(async () => {
      const cartId = await getCartId();

      if (!cartId) {
        return;
      }

      await addToCart.mutateAsync({
        cartId,
        variantId: props.variantId ?? "",
        quantity: props.quantity ?? 1,
      });
      void apiUtils.cart.invalidate();

      void router.refresh();
    });
  }

  return (
    <LoadButton
      onClick={() => void handleAddToCart()}
      loadingText="Adding..."
      className="w-full"
      isLoading={isPending}
    >
      Add to Cart
    </LoadButton>
  );
}
