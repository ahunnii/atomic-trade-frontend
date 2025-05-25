import type Stripe from "stripe";
import { env } from "~/env";

type Props = {
  cartId: string;
  cartItems: {
    id: string;
    variantId: string;
    variant: {
      id: string;
      name: string;
      priceInCents: number;
      product: {
        featuredImage: string;
        id: string;
        name: string;
      };
    };
    quantity: number;
  }[];
};
export function cartToLineItems({ cartId, cartItems }: Props) {
  return cartItems.map((item) => {
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item?.variant?.product?.name ?? "Custom Product",
          description: item?.variant?.name ?? "Default",
          images: [
            item?.variant?.product?.featuredImage ??
              `${env.NEXT_PUBLIC_STORAGE_URL}/misc/placeholder-image.webp`,
          ],
          metadata: {
            productId: item?.variant?.product?.id ?? "",
            variantId: item?.variant?.id ?? "",
            orderItemId: item?.id ?? "",
            cartItemId: item?.id ?? "",
            cartId: cartId ?? "",
          },
        },

        unit_amount: item?.variant?.priceInCents,
      },

      quantity: item.quantity,
    } as Stripe.Checkout.SessionCreateParams.LineItem;
  });
}
