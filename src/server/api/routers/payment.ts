import type Stripe from "stripe";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import { stripeClient } from "~/lib/payments/clients/stripe";
import { webhookDataToOrder } from "~/lib/payments/utils/webhook-data-to-order";

export const paymentRouter = createTRPCRouter({
  createOrderFromCheckoutSession: publicProcedure
    .input(z.object({ session: z.any(), type: z.enum(["stripe"]) }))
    .mutation(async ({ ctx, input: { session, type } }) => {
      if (type === "stripe") {
        const order = await webhookDataToOrder(
          session as Stripe.Checkout.Session,
        );

        return {
          data: order,
          message: "Checkout session updated successfully",
        };
      }

      return {
        data: null,
        message:
          "Something went wrong when creating your order. Please try again.",
      };
    }),
});
