import type { Cart, Store } from "@prisma/client";
import { z } from "zod";

export const checkoutSchema = z.object({
  storeId: z.string(),
  cartId: z.string(),
  couponCode: z.string().optional(),
});
