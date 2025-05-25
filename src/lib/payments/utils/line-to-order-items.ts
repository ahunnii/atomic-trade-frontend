import type Stripe from "stripe";
import { db } from "~/server/db";
import { stripeClient } from "../clients/stripe";

interface StripeLineItemMeta {
  productId: string;
  variantId: string;
  orderItemId: string;
  cartItemId: string;
  cartId: string;
}

export const lineToOrderItems = async (sessionId: string) => {
  const sessionLineItems = await stripeClient.checkout.sessions.listLineItems(
    sessionId,
    { expand: ["data.price.product"] },
  );

  const orderItems = await Promise.all(
    sessionLineItems.data?.map(async (item: Stripe.LineItem) => {
      const product = item?.price?.product as Stripe.Product;
      const metadata = product?.metadata as unknown as StripeLineItemMeta;

      const variant = metadata?.variantId
        ? await db.variation.findUnique({
            where: { id: metadata?.variantId },
          })
        : null;

      if (variant?.manageStock) {
        const currentStock = variant.stock;
        if (currentStock < (item.quantity ?? 1) || currentStock === 0) {
          throw new Error("Insufficient stock");
        }

        await db.variation.update({
          where: { id: variant.id },
          data: { stock: currentStock - (item.quantity ?? 1) },
        });
      }

      return {
        name: product?.name ?? "Unknown Item",
        description: product?.description ?? "Default",
        variantId: metadata?.variantId ?? null,
        quantity: item.quantity ?? 1,
        unitPriceInCents:
          variant?.priceInCents ?? Number(item.price?.unit_amount) ?? 0,
        discountInCents: 0,
        totalPriceInCents: Number(item.price?.unit_amount) ?? 0,
        isPhysical: true,
        isTaxable: true,
        metadata: {
          discountReason: "",
          discountType: "",
        },
      };
    }) ?? [],
  );

  return {
    orderItems,
    discountInCents: 0,
    subtotalInCents: orderItems.reduce(
      (acc, item) => acc + item.totalPriceInCents * item.quantity,
      0,
    ),
    totalInCents:
      orderItems.reduce(
        (acc, item) => acc + item.totalPriceInCents * item.quantity,
        0,
      ) - 0,
  };
};
