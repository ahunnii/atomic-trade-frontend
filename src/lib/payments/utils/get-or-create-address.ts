import type Stripe from "stripe";

import { db } from "~/server/db";

import type { Address } from "@prisma/client";

type Props = {
  customerAddresses: Address[];
  address: Stripe.Address | null;
  customerName: string;
  customerId: string;
  customerPhone?: string;
};

export const getOrCreateAddress = async ({
  customerAddresses,
  address,
  customerName,
  customerId,
  customerPhone,
}: Props) => {
  if (!address) return null;

  const existingAddress = customerAddresses.find(
    (a) =>
      a.street === address.line1 &&
      a.additional === address.line2 &&
      a.city === address.city &&
      a.state === address.state &&
      a.postalCode === address.postal_code &&
      a.country === address.country &&
      a.firstName === customerName.split(" ")[0] &&
      a.lastName === customerName.split(" ")[1],
  );

  if (existingAddress) return existingAddress;

  const newAddress = await db.address.create({
    data: {
      customerId,
      formatted: `${address?.line1}${address?.line2 ? ` ${address?.line2}` : ""}, ${address?.city}, ${address?.state} ${address?.postal_code}, ${address?.country}`,
      city: address?.city ?? "",
      state: address?.state ?? "",
      country: address?.country ?? "",
      postalCode: address?.postal_code ?? "",
      isDefault: false,
      street: address?.line1 ?? "",
      additional: address?.line2 ?? "",
      firstName: customerName?.split(" ")[0] ?? "",
      lastName: customerName?.split(" ")[1] ?? "",
      phone: customerPhone ?? null,
    },
  });

  return newAddress;
};
