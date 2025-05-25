import type { Address } from "@prisma/client";
import type Stripe from "stripe";

export const compareAddresses = (
  address1: Omit<Address, "id"> | undefined,
  address2: Omit<Address, "id"> | undefined,
) => {
  if (!address1 || !address2) return false;
  if (address1.formatted === address2.formatted) return true;

  return (
    address1.street === address2.street &&
    address1.city === address2.city &&
    address1.state === address2.state &&
    address1.postalCode === address2.postalCode &&
    address1.country === address2.country
  );
};

type StripeAddress = {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
};

export function normalizeAddress(
  address: Stripe.Address,
): Record<string, string> {
  const fields = ["line1", "line2", "city", "state", "postal_code", "country"];
  const normalized: Record<string, string> = {};

  for (const field of fields) {
    const value = address[field as keyof StripeAddress];
    normalized[field] = (value ?? "").trim().toLowerCase();
  }

  return normalized;
}

export function addressesAreSame(
  a: Stripe.Address | null,
  b: Stripe.Address | null,
): boolean {
  if (!a || !b) return false;

  const normA = normalizeAddress(a);
  const normB = normalizeAddress(b);

  return Object.keys(normA).every((key) => normA[key] === normB[key]);
}
