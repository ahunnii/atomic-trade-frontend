import type Stripe from "stripe";
import { db } from "~/server/db";
import { stripeClient } from "../clients/stripe";

type Props = {
  session: Stripe.Checkout.Session;
  orderId: string;
};
export const createPaymentIntent = async ({ session, orderId }: Props) => {
  const paymentIntent = await stripeClient.paymentIntents.retrieve(
    session.payment_intent as string,
  );

  await db.payment.create({
    data: {
      orderId,
      amountInCents: paymentIntent.amount,
      status: "PAID",
      method: "STRIPE",
      metadata: { paymentIntentId: paymentIntent.id },
    },
  });

  return paymentIntent;
};
