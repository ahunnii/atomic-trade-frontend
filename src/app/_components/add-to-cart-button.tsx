"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { LoadButton } from "~/components/common/load-button";
import { Button } from "~/components/ui/button";
import {
  getCartId,
  getYeetId,
  setCartId,
  setRandom,
} from "~/server/actions/cart";
import { api } from "~/trpc/react";

export function AddToCartButton(props: {
  quantity?: number;
  variantId?: string;
}) {
  const apiUtils = api.useUtils();
  const createCart = api.cart.create.useMutation({
    onSettled: () => {
      void apiUtils.cart.invalidate();
    },
  });
  const addToCart = api.cart.update.useMutation({
    onSettled: () => {
      void apiUtils.cart.invalidate();
    },
  });
  const router = useRouter();

  async function handleAddToCart() {
    let cartId = await getCartId();

    if (!cartId) {
      const cart = await createCart.mutateAsync();
      void setCartId(cart.data.id);
      void apiUtils.cart.invalidate();
      cartId = cart.data.id;
    }
    await addToCart.mutateAsync({
      cartId: cartId ?? "",
      variantId: props.variantId ?? "",
      quantity: props.quantity ?? 1,
    });

    void router.refresh();
  }

  return (
    <LoadButton
      onClick={() => void handleAddToCart()}
      loadingText="Adding..."
      isLoading={createCart.isPending || addToCart.isPending}
    >
      Add to Cart
    </LoadButton>
  );
}
