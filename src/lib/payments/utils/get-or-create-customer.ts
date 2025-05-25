import type Stripe from "stripe";

import { db } from "~/server/db";

import { stripeClient } from "../clients/stripe";

type Props = {
  storeId: string;
  email: string;
  customerName: string;
  address: Stripe.Address | null;
};

export const getOrCreateCustomer = async ({
  email,
  customerName,
  address,
  storeId,
}: Props) => {
  const customer = await db.customer.findFirst({
    where: { email },
    include: { addresses: true },
  });

  if (customer) return customer;

  const stripeCustomer = await stripeClient.customers.create({
    email,
    name: customerName,
    ...(address && {
      address: {
        line1: address.line1 ?? "",
        line2: address.line2 ?? "",
        city: address.city ?? "",
        state: address.state ?? "",
        postal_code: address.postal_code ?? "",
        country: address.country ?? "",
      },
    }),
  });

  const dbCustomer = await db.customer.create({
    data: {
      email,
      firstName: customerName.split(" ")[0] ?? "",
      lastName: customerName.split(" ")[1] ?? "",
      storeId: storeId,
      metadata: { stripeCustomerId: stripeCustomer.id },
    },
  });

  if (address) {
    await db.address.create({
      data: {
        customerId: dbCustomer.id,
        formatted: `${address?.line1}${address?.line2 ? ` ${address?.line2}` : ""}, ${address?.city}, ${address?.state} ${address?.postal_code}, ${address?.country}`,
        city: address?.city ?? "",
        state: address?.state ?? "",
        country: address?.country ?? "",
        postalCode: address?.postal_code ?? "",
        isDefault: true,
        street: address?.line1 ?? "",
        additional: address?.line2 ?? "",
        firstName: customerName?.split(" ")[0] ?? "",
        lastName: customerName?.split(" ")[1] ?? "",
      },
    });
  }

  const createdCustomer = await db.customer.findFirst({
    where: { id: dbCustomer.id },
    include: { addresses: true },
  });

  return createdCustomer;
};
