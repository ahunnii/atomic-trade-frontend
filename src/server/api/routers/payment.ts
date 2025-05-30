import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

import { webhookDataToOrder } from "~/lib/core/checkout";

export const paymentRouter = createTRPCRouter({
  handleWebhookCheckoutSession: publicProcedure
    .input(z.object({ session: z.any() }))
    .mutation(async ({ input: { session } }) => {
      const order = await webhookDataToOrder(session);

      return {
        data: order,
        message: "Checkout session updated successfully",
      };
    }),
});
