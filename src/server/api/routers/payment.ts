import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

import type { Stripe } from "@atomic-trade/payments";

import { webhookDataToOrder } from "~/lib/core/checkout";

export const paymentRouter = createTRPCRouter({
  createOrderFromCheckoutSession: publicProcedure
    .input(z.object({ session: z.any(), type: z.enum(["stripe"]) }))
    .mutation(async ({ input: { session, type } }) => {
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
