import { paymentService } from "@atomic-trade/payments";

import { createWebhookOrder, updateWebhookOrder } from "./order";

export const webhookDataToOrder = async (session: unknown) => {
  const checkoutSessionData =
    await paymentService.checkout.formatCheckoutSessionData({
      session,
    });

  const orderId = checkoutSessionData?.orderId ?? "";

  if (orderId && orderId.length > 0) {
    const result = await updateWebhookOrder({
      orderId,
      checkoutSessionData,
    });
    return result;
  } else {
    const result = await createWebhookOrder(session);
    return result;
  }
};
