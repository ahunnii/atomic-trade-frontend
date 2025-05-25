import { FulfillmentStatus, type Address } from "@prisma/client";
import type Stripe from "stripe";
import { env } from "~/env";
import { db } from "~/server/db";
import {
  generateOrderAuthNumber,
  generateOrderNumber,
} from "~/utils/generate-order-numbers";
import { stripeClient } from "../clients/stripe";
import { addressesAreSame, compareAddresses } from "./compare-addresses";
import { createPaymentIntent } from "./create-payment-intent";
import { getOrCreateAddress } from "./get-or-create-address";
import { getOrCreateCustomer } from "./get-or-create-customer";
import { lineToOrderItems } from "./line-to-order-items";

interface StripeLineItemMeta {
  productId: string;
  variantId: string;
  orderItemId: string;
  cartItemId: string;
  cartId: string;
}

export const webhookDataToOrder = async (session: Stripe.Checkout.Session) => {
  const email = session?.customer_details?.email;
  const storeSlug = env.STORE_NAME.toLowerCase().replace(" ", "-");

  const store = await db.store.findFirst({
    where: {
      OR: [{ slug: storeSlug }, { id: session?.metadata?.storeId ?? "" }],
    },
  });

  const numberOfOrders = await db.order.count({
    where: {
      storeId: store?.id ?? "",
      status: { not: "DRAFT" },
    },
  });

  const customer = await getOrCreateCustomer({
    storeId: store?.id ?? "",
    email: email ?? "",
    customerName: session?.collected_information?.shipping_details?.name ?? "",
    address: session?.collected_information?.shipping_details?.address ?? null,
  });

  const sameAddress = addressesAreSame(
    session?.collected_information?.shipping_details?.address ?? null,
    session?.customer_details?.address ?? null,
  );

  const shippingAddress = await getOrCreateAddress({
    customerAddresses: customer?.addresses ?? [],
    address: session?.collected_information?.shipping_details?.address ?? null,
    customerName: session?.collected_information?.shipping_details?.name ?? "",
    customerId: customer?.id ?? "",
    customerPhone: session?.customer_details?.phone ?? "",
  });

  const billingAddress = sameAddress
    ? shippingAddress
    : await getOrCreateAddress({
        customerAddresses: customer?.addresses ?? [],
        address: session?.customer_details?.address ?? null,
        customerName: session?.customer_details?.name ?? "",
        customerId: customer?.id ?? "",
        customerPhone: session?.customer_details?.phone ?? "",
      });

  const { orderItems, discountInCents, subtotalInCents } =
    await lineToOrderItems(session.id);
  const orderNumber = generateOrderNumber(numberOfOrders, storeSlug);
  const authorizationCode = generateOrderAuthNumber();

  const { latest_charge } = await stripeClient.paymentIntents.retrieve(
    session.payment_intent as string,
    { expand: ["latest_charge", "latest_charge.balance_transaction"] },
  );

  const order = await db.order.create({
    data: {
      email,
      phone: session?.customer_details?.phone ?? "",
      storeId: session.metadata?.storeId ?? "",
      orderNumber,
      authorizationCode,
      paymentStatus: "PAID",
      status: "PENDING",
      fulfillmentStatus: "IN_PROGRESS",
      discountInCents,
      subtotalInCents,
      totalInCents: session?.amount_total ?? 0,
      taxInCents: session?.total_details?.amount_tax ?? 0,
      shippingInCents: session?.total_details?.amount_shipping ?? 0,
      feeInCents:
        (
          (latest_charge as Stripe.Charge)
            ?.balance_transaction as Stripe.BalanceTransaction
        )?.fee ?? 0,
      customerId: customer?.id ?? "",
      shippingAddressId: shippingAddress?.id ?? "",
      billingAddressId: billingAddress?.id ?? "",
      orderItems: {
        create: orderItems,
      },
      areAddressesSame: sameAddress,
      metadata: {
        stripeCheckoutSessionId: session.id,
      },
      receiptLink: (latest_charge as Stripe.Charge)?.receipt_url ?? "",
    },
  });

  await createPaymentIntent({
    session,
    orderId: order.id,
  });

  await db.timelineEvent.create({
    data: {
      orderId: order.id,
      title: "Order created",
      description: `Order placed and paid on ${new Date().toLocaleString()}`,
      isEditable: false,
    },
  });

  const orderShippingAddress = shippingAddress?.formatted
    ? await db.address.create({
        data: {
          street: shippingAddress.street,
          city: shippingAddress.city,
          state: shippingAddress.state,
          postalCode: shippingAddress.postalCode,
          country: shippingAddress.country,
          additional: shippingAddress.additional,
          formatted: shippingAddress.formatted,
          phone: shippingAddress.phone,
          firstName: shippingAddress.firstName,
          lastName: shippingAddress.lastName,
          shippingOrder: { connect: { id: order.id } },
        },
      })
    : null;

  const orderBillingAddress = billingAddress?.formatted
    ? await db.address.create({
        data: {
          street: billingAddress.street,
          city: billingAddress.city,
          state: billingAddress.state,
          postalCode: billingAddress.postalCode,
          country: billingAddress.country,
          additional: billingAddress.additional,
          formatted: billingAddress.formatted,
          phone: billingAddress.phone,
          firstName: billingAddress.firstName,
          lastName: billingAddress.lastName,
          billingOrder: { connect: { id: order.id } },
        },
      })
    : null;

  const fulfillment = await db.fulfillment.create({
    data: {
      order: { connect: { id: order.id } },
      status: FulfillmentStatus.PENDING,
    },
  });

  return order;
};
