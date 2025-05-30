import { db } from "~/server/db";
import { formatNoRespondEmail } from "~/utils/format-store-emails";
import {
  generateOrderAuthNumber,
  generateOrderNumber,
} from "~/utils/generate-order-numbers";

import type { FormattedCheckoutSessionData } from "@atomic-trade/payments";
import { emailService } from "@atomic-trade/email";
import {
  addressesAreSame,
  lineToOrderItems,
  paymentService,
} from "@atomic-trade/payments";
import { FulfillmentStatus } from "@prisma/client";

import { env } from "~/env";

import { NewOrderEmail } from "../email-templates/new-order-email";
import { ThankYouOrderEmail } from "../email-templates/thank-you-order-email";
import {
  createPaymentIntent,
  getOrCreateAddress,
  getOrCreateCustomer,
} from "./payments";

export const updateWebhookOrder = async ({
  orderId,
  checkoutSessionData,
}: {
  orderId: string;
  checkoutSessionData: FormattedCheckoutSessionData;
}) => {
  const currentOrder = await db.order.findUnique({
    where: { id: orderId },
    include: {
      store: true,
      customer: {
        include: { addresses: true },
      },
      orderItems: {
        include: { variant: { include: { product: true } } },
      },
      fulfillment: true,
      timeline: true,
      billingAddress: true,
      shippingAddress: true,
    },
  });

  if (!currentOrder) {
    throw new Error("Order not found");
  }

  const numberOfOrders = await db.order.count({
    where: {
      storeId: currentOrder?.storeId ?? "",
      status: { not: "DRAFT" },
    },
  });

  const sameAddress = addressesAreSame(
    checkoutSessionData.shippingAddress ?? null,
    checkoutSessionData.billingAddress ?? null,
  );

  const shippingAddress = await getOrCreateAddress({
    customerAddresses: currentOrder?.customer?.addresses ?? [],
    address: checkoutSessionData.shippingAddress ?? null,
    customerName: checkoutSessionData.shippingAddress.name ?? "",
    customerId: currentOrder?.customer?.id ?? "",
    customerPhone: checkoutSessionData.customer.phone ?? "",
  });

  const billingAddress = sameAddress
    ? shippingAddress
    : await getOrCreateAddress({
        customerAddresses: currentOrder?.customer?.addresses ?? [],
        address: checkoutSessionData.billingAddress ?? null,
        customerName: checkoutSessionData.billingAddress.name ?? "",
        customerId: currentOrder?.customer?.id ?? "",
        customerPhone: checkoutSessionData.customer.phone ?? "",
      });

  const handleVariant = async (variantId: string, quantity: number) => {
    const variant = variantId
      ? await db.variation.findUnique({
          where: { id: variantId },
          include: { product: true },
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
  const items = await Promise.all(
    (currentOrder?.orderItems ?? []).map(async (item) => {
      const variant = await handleVariant(item.variantId ?? "", item.quantity);
      return {
        ...item,
        variant,
      };
    }),
  );

  //TODO: calculate discountInCents
  const discountInCents = currentOrder?.discountInCents ?? 0;
  const subtotalInCents = currentOrder?.subtotalInCents ?? 0;
  const totalInCents = checkoutSessionData.totals.total ?? 0;

  const orderNumber = generateOrderNumber(
    numberOfOrders,
    currentOrder?.store?.slug ?? "",
  );
  const authorizationCode = generateOrderAuthNumber();

  const { paymentReceipt, processorFee } =
    await paymentService.transaction.getPaymentIntent({
      paymentIntentId: checkoutSessionData.intentId ?? "",
    });

  // Create new address records first
  let newShippingAddress = null;
  let newBillingAddress = null;

  if (shippingAddress?.formatted) {
    newShippingAddress = await db.address.create({
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
      },
    });
  }

  if (billingAddress?.formatted && !sameAddress) {
    newBillingAddress = await db.address.create({
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
      },
    });
  }

  await db.order.update({
    where: { id: orderId },
    data: {
      paymentStatus: "PAID",
      status: "PENDING",
      fulfillmentStatus: "IN_PROGRESS",
      discountInCents,
      totalInCents,
      subtotalInCents,
      authorizationCode,
      orderNumber,
      feeInCents: processorFee,
      shippingAddressId: newShippingAddress?.id ?? "",
      billingAddressId: sameAddress
        ? newShippingAddress?.id
        : (newBillingAddress?.id ?? ""),
      areAddressesSame: sameAddress,
      metadata: { ...checkoutSessionData.orderMetadata },
      receiptLink: paymentReceipt,
      payments: {
        create: {
          amountInCents: checkoutSessionData.totals.total ?? 0,
          method: "STRIPE",
          status: "PAID",
        },
      },
    },
  });
  await db.fulfillment.create({
    data: {
      order: { connect: { id: currentOrder?.id ?? "" } },
      status: "PENDING",
    },
  });
  await db.timelineEvent.create({
    data: {
      orderId: currentOrder?.id ?? "",
      title: "Order payment collected",
      description: `Order was marked as PAID on ${new Date().toLocaleString()}`,
      isEditable: false,
    },
  });

  await createPaymentIntent({
    sessionId: checkoutSessionData.sessionId ?? "",
    orderId: currentOrder?.id,
  });

  if (currentOrder.email) {
    const noReplyEmail = formatNoRespondEmail(currentOrder?.store?.name ?? "");
    const logoUrl = `${currentOrder?.store?.logo}`;
    await emailService.sendEmail({
      to: currentOrder.email,
      from: noReplyEmail,
      subject: `Thank you for your order from ${currentOrder?.store?.name}`,
      template: ThankYouOrderEmail,
      data: {
        email: currentOrder.email,
        name: checkoutSessionData.customer.name ?? "",
        storeName: currentOrder?.store?.name ?? "",
        orderNumber,
        orderTotal: checkoutSessionData.totals.total ?? 0,
        orderItems: items.map((item) => ({
          name: item.variant?.product?.name ?? "",
          quantity: item.quantity,
          price: item.totalPriceInCents,
        })),
        logoUrl,
      },
    });

    const adminUrl = `${env.BACKEND_URL}/${currentOrder.store?.slug}`;

    await emailService.sendEmail({
      to: currentOrder.store?.contactEmail ?? "",
      from: noReplyEmail,
      subject: `New order #${orderNumber} received`,
      template: NewOrderEmail,
      data: {
        orderNumber,
        customerName: checkoutSessionData.customer.name ?? "",
        storeName: currentOrder?.store?.name ?? "",
        orderTotal: checkoutSessionData.totals.total ?? 0,
        orderItems: items.map((item) => ({
          name: item.variant?.product?.name ?? "",
          quantity: item.quantity,
          price: item.totalPriceInCents,
        })),
        orderId: currentOrder?.id ?? "",
        logoUrl,
        adminUrl,
      },
    });
  }

  return currentOrder;
};

export const createWebhookOrder = async (session: unknown) => {
  const storeSlug = env.STORE_NAME.toLowerCase().replace(" ", "-");

  const checkoutSessionData =
    await paymentService.checkout.formatCheckoutSessionData({
      session,
    });

  if (checkoutSessionData?.orderId) {
    return null;
  }

  const email = checkoutSessionData?.customer?.email;
  const storeMetaId = checkoutSessionData?.storeId;
  const sessionId = checkoutSessionData?.sessionId ?? "";

  const store = await db.store.findFirst({
    where: {
      OR: [{ slug: storeSlug }, { id: storeMetaId ?? "" }],
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
      sessionId,
      handleStockUpdate: handleVariant,
    });
  const orderNumber = generateOrderNumber(numberOfOrders, storeSlug);
  const authorizationCode = generateOrderAuthNumber();

  const { paymentReceipt, processorFee } =
    await paymentService.transaction.getPaymentIntent({
      paymentIntentId: checkoutSessionData.intentId ?? "",
    });

  // Create new address records first
  let newShippingAddress = null;
  let newBillingAddress = null;

  if (shippingAddress?.formatted) {
    newShippingAddress = await db.address.create({
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
      },
    });
  }

  if (billingAddress?.formatted && !sameAddress) {
    newBillingAddress = await db.address.create({
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
      },
    });
  }

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
      shippingAddressId: newShippingAddress?.id ?? "",
      billingAddressId: sameAddress
        ? newShippingAddress?.id
        : (newBillingAddress?.id ?? ""),
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

  await db.fulfillment.create({
    data: {
      order: { connect: { id: order.id } },
      status: FulfillmentStatus.PENDING,
    },
  });

  if (email) {
    const noReplyEmail = formatNoRespondEmail(store?.name ?? "");
    const logoUrl = `${store?.logo}`;
    await emailService.sendEmail({
      to: email,
      from: noReplyEmail,
      subject: `Thank you for your order from ${store?.name}`,
      template: ThankYouOrderEmail,
      data: {
        email,
        name: checkoutSessionData.customer.name ?? "",
        storeName: store?.name ?? "",
        orderNumber,
        orderTotal: checkoutSessionData.totals.total ?? 0,
        orderItems: orderItems.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.totalPriceInCents,
        })),
        logoUrl,
      },
    });

    const adminUrl = `${env.BACKEND_URL}/${store?.slug}`;

    await emailService.sendEmail({
      to: store?.contactEmail ?? "",
      from: noReplyEmail,
      subject: `New order #${orderNumber} received`,
      template: NewOrderEmail,
      data: {
        orderNumber,
        customerName: checkoutSessionData.customer.name ?? "",
        storeName: store?.name ?? "",
        orderTotal: checkoutSessionData.totals.total ?? 0,
        orderItems: orderItems.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.totalPriceInCents,
        })),
        orderId: order.id,
        logoUrl,
        adminUrl,
      },
    });
  }

  return order;
};
