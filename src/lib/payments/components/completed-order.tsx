import { CheckCircle, XCircle } from "lucide-react";
import { paymentService, paymentServiceType } from "..";
import { ManualCompletedOrder } from "./stripe/manual-completed-order";
import { StripeCompletedOrder } from "./stripe/stripe-completed-order";

export const CompletedOrder = ({
  session_id,
  orderId,
  backToAccount = false,
}: {
  session_id?: string | null;
  orderId?: string | null;
  backToAccount?: boolean;
}) => {
  if (paymentServiceType === "stripe" && session_id) {
    return (
      <StripeCompletedOrder
        session_id={session_id}
        backToAccount={backToAccount}
      />
    );
  }

  if (orderId) {
    return (
      <ManualCompletedOrder orderId={orderId} backToAccount={backToAccount} />
    );
  }

  return (
    <>
      {session_id ? (
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
            No session ID provided. Please try checking out again.
          </p>
        </>
      )}
    </>
  );
};
