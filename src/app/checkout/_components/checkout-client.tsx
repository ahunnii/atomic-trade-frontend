"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { env } from "~/env";
import { CheckoutPayment } from "./checkout-payment";
import { CheckoutSummary, type DiscountedCartData } from "./checkout-summary";
import { LinkAuth } from "./link-auth";
import { ShippingAddress } from "./shipping-address";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined");
}
const stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function CheckoutClient({
  totalInCents,
  email,
}: {
  totalInCents: number;
  email?: string;
}) {
  return (
    <Elements
      stripe={stripePromise}
      options={{
        mode: "payment",
        amount: totalInCents,
        currency: "usd",
      }}
    >
      {/* <LinkAuth email={email} />
      <ShippingAddress /> */}
      <CheckoutPayment
        subtotalInCents={totalInCents ?? 0}
        email={email ?? undefined}
      />
    </Elements>
  );
}
