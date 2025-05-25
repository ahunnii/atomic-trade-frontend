"use server";
import { CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { stripeClient } from "~/lib/payments/clients/stripe";
import { CompletedOrder } from "~/lib/payments/components/completed-order";
import { clearCartId, getCartId } from "~/server/actions/cart";
import { auth } from "~/server/auth";
import { api } from "~/trpc/server";

type Props = { searchParams: Promise<{ session_id?: string }> };

export default async function SuccessPage({ searchParams }: Props) {
  const { session_id } = await searchParams;

  const session = await auth();
  let isSuccess = false;
  let errorMessage = "";

  if (session_id) {
    try {
      const session = await stripeClient.checkout.sessions.retrieve(session_id);
      isSuccess = session.payment_status === "paid";

      if (isSuccess) {
        // Delete the cart after successful payment
        // const cartId = await getCartId();
        // if (cartId) {
        //   await api.cart.delete(cartId);
        //   await clearCartId();
        // }
      } else {
        errorMessage = "Your payment was not successful. Please try again.";
      }
    } catch (error) {
      errorMessage =
        "There was an error processing your payment. Please try again.";
    }
  } else {
    errorMessage = "No session ID provided. Please try checking out again.";
  }

  if (!session_id && session?.user?.id) {
    redirect("/account/orders");
  }

  if (!session_id && !session?.user?.id) {
    redirect("/auth/sign-in?callbackUrl=/account/orders");
  }

  return (
    <div className="container mx-auto min-h-[80svh] px-4 py-8">
      <div className="flex flex-col items-center justify-center space-y-6">
        {/* {isSuccess ? (
          <>
            <CheckCircle className="h-16 w-16 text-green-500" />
            <h1 className="text-center text-4xl font-bold">Thank You!</h1>
            <p className="text-muted-foreground text-center text-lg">
              Your order has been successfully placed.
            </p>
            <p className="text-muted-foreground text-center">
              We&apos;ll send you an email confirmation shortly.
            </p>
          </>
        ) : (
          <>
            <XCircle className="h-16 w-16 text-red-500" />
            <h1 className="text-center text-4xl font-bold">Payment Failed</h1>
            <p className="text-muted-foreground text-center text-lg">
              {errorMessage}
            </p>
          </>
        )} */}

        <CompletedOrder session_id={session_id ?? ""} />
        <Link
          href="/collections/all-products"
          className="group relative mt-8 block text-center text-base font-medium"
        >
          <span className="relative inline-block">
            Continue Shopping
            <span className="absolute bottom-0 left-0 h-[2.5px] w-full bg-current opacity-25"></span>
            <span className="absolute bottom-0 left-0 h-[2.5px] w-0 bg-current transition-all duration-300 group-hover:w-full"></span>
          </span>
        </Link>
      </div>
    </div>
  );
}
