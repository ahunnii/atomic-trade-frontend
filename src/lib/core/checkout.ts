import { db } from "~/server/db";
import {
  generateOrderAuthNumber,
  generateOrderNumber,
} from "~/utils/generate-order-numbers";

import type { Stripe } from "@atomic-trade/payments";
import {
  addressesAreSame,
  lineToOrderItems,
  paymentService,
} from "@atomic-trade/payments";
import { FulfillmentStatus } from "@prisma/client";

import { env } from "~/env";
import {
  createPaymentIntent,
  getOrCreateAddress,
  getOrCreateCustomer,
} from "~/lib/core/payments";

export const webhookDataToOrder = async (session: Stripe.Checkout.Session) => {
  const email = session?.customer_details?.email;
  const storeSlug = env.STORE_NAME.toLowerCase().replace(" ", "-");

  const checkoutSessionData = await paymentService.formatCheckoutSessionData({
    session,
  });

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
    customerName: checkoutSessionData.customer.name ?? "",
    address: checkoutSessionData.shippingAddress ?? null,
  });

  const sameAddress = addressesAreSame(
    checkoutSessionData.shippingAddress ?? null,
    checkoutSessionData.billingAddress ?? null,
  );

  const shippingAddress = await getOrCreateAddress({
    customerAddresses: customer?.addresses ?? [],
    address: checkoutSessionData.shippingAddress ?? null,
    customerName: checkoutSessionData.shippingAddress.name ?? "",
    customerId: customer?.id ?? "",
    customerPhone: checkoutSessionData.customer.phone ?? "",
  });

  const billingAddress = sameAddress
    ? shippingAddress
    : await getOrCreateAddress({
        customerAddresses: customer?.addresses ?? [],
        address: checkoutSessionData.billingAddress ?? null,
        customerName: checkoutSessionData.billingAddress.name ?? "",
        customerId: customer?.id ?? "",
        customerPhone: checkoutSessionData.customer.phone ?? "",
      });

  const handleVariant = async (variantId: string, quantity: number) => {
    const variant = variantId
      ? await db.variation.findUnique({
          where: { id: variantId },
        })
      : null;

    if (variant?.manageStock) {
      const currentStock = variant.stock;
      if (currentStock < quantity || currentStock === 0) {
        throw new Error("Insufficient stock");
      }

      await db.variation.update({
        where: { id: variant.id },
        data: { stock: currentStock - quantity },
      });
    }

    return variant;
  };

  const { orderItems, discountInCents, subtotalInCents } =
    await lineToOrderItems({
      sessionId: session.id,
      handleStockUpdate: handleVariant,
    });
  const orderNumber = generateOrderNumber(numberOfOrders, storeSlug);
  const authorizationCode = generateOrderAuthNumber();

  const { paymentReceipt, processorFee } =
    await paymentService.getPaymentIntent({
      paymentIntentId: session.payment_intent as string,
    });

  const order = await db.order.create({
    data: {
      email,
      phone: checkoutSessionData.customer.phone ?? "",
      storeId: checkoutSessionData.storeId ?? "",
      orderNumber,
      authorizationCode,
      paymentStatus: "PAID",
      status: "PENDING",
      fulfillmentStatus: "IN_PROGRESS",
      discountInCents,
      subtotalInCents,
      totalInCents: checkoutSessionData.totals.total ?? 0,
      taxInCents: checkoutSessionData.totals.tax ?? 0,
      shippingInCents: checkoutSessionData.totals.shipping ?? 0,
      feeInCents: processorFee,
      customerId: customer?.id ?? "",
      shippingAddressId: shippingAddress?.id ?? "",
      billingAddressId: billingAddress?.id ?? "",
      orderItems: { create: orderItems },
      areAddressesSame: sameAddress,
      metadata: { ...checkoutSessionData.orderMetadata },
      receiptLink: paymentReceipt,
    },
  });

  await createPaymentIntent({
    sessionId: checkoutSessionData.sessionId ?? "",
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

  if (shippingAddress?.formatted) {
    await db.address.create({
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
    });
  }

  if (billingAddress?.formatted) {
    await db.address.create({
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
    });
  }

  await db.fulfillment.create({
    data: {
      order: { connect: { id: order.id } },
      status: FulfillmentStatus.PENDING,
    },
  });

  return order;
};
