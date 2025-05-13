"use client";
import type { Product, Variation } from "@prisma/client";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { formatCurrency } from "~/utils/format-currency";
import { BillingAddress } from "./billing-address";
import { LinkAuth } from "./link-auth";
import { ShippingAddress } from "./shipping-address";

type CartItem = {
  id: string;
  variantId: string;
  variant: Variation & { product?: Product };
  quantity: number;
};

type Cart = {
  id: string;
  cartItems: CartItem[];
};

type Props = {
  subtotalInCents: number;
  email?: string;
};

export function CheckoutPayment({ subtotalInCents, email }: Props) {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [clientSecret, setClientSecret] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    void fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amountInCents: subtotalInCents }),
    })
      .then((res) => res.json())
      .then((data: { clientSecret: string }) =>
        setClientSecret(data.clientSecret),
      );
  }, [subtotalInCents]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      return;
    }

    const { error: submitError } = await elements.submit();

    if (submitError) {
      setErrorMessage(submitError.message);
      setLoading(false);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `http://www.localhost:3000/payment-success?amount=${subtotalInCents}`,
      },
    });

    if (error) {
      // This point is only reached if there's an immediate error when
      // confirming the payment. Show the error to your customer (for example, payment details incomplete)
      setErrorMessage(error.message);
    } else {
      // The payment UI automatically closes with a success animation.
      // Your customer is redirected to your `return_url`.
    }

    setLoading(false);
  };

  if (!clientSecret || !stripe || !elements) {
    return (
      <div className="flex items-center justify-center">
        <div
          className="text-surface inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !border-0 !p-0 !whitespace-nowrap ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <LinkAuth email={email} />
      <ShippingAddress />
      <BillingAddress />
      <div>
        <h3 className="text-lg font-bold">Payment</h3>
        <p className="text-muted-foreground text-sm">
          All transactions are secure and encrypted.
        </p>
        {clientSecret && <PaymentElement />}
      </div>

      {errorMessage && <div>{errorMessage}</div>}

      <button
        disabled={!stripe || loading}
        className="mt-2 w-full rounded-md bg-black p-5 font-bold text-white disabled:animate-pulse disabled:opacity-50"
      >
        {!loading ? `Pay ${formatCurrency(subtotalInCents)}` : "Processing..."}
      </button>

      <p className="text-muted-foreground text-sm">
        Your info will be saved as a customer account. By continuing, you agree
        to Shop’s Terms of Service and acknowledge the Privacy Policy.
      </p>
    </form>
  );
}
