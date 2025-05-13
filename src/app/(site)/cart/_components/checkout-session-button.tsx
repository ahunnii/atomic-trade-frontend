"use client";

import { toastService } from "@dreamwalker-studios/toasts";
import { ShoppingCart } from "lucide-react";
import { LoadButton } from "~/components/common/load-button";
import { useDefaultMutationActions } from "~/hooks/use-default-mutation-actions";
import { api } from "~/trpc/react";

export function CheckoutSessionButton({ cartId }: { cartId: string }) {
  const { defaultActions } = useDefaultMutationActions({
    invalidateEntities: ["cart"],
  });
  const checkoutSessionMutation = api.store.checkout.useMutation({
    ...defaultActions,
    onSuccess: (data) => {
      window.location.href = data.checkoutSession.sessionUrl;
    },
    onError: () => {
      toastService.error(
        "There seems to be an issue checking out. Please try again.",
      );
    },
  });

  return (
    <LoadButton
      isLoading={checkoutSessionMutation.isPending}
      onClick={() => checkoutSessionMutation.mutate({ cartId: cartId })}
      className="mt-4 w-full"
    >
      <ShoppingCart className="mr-2 h-4 w-4" />
      Proceed to Checkout
    </LoadButton>
  );
}
