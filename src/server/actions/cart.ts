"use server";

import { cookies } from "next/headers";

export async function getCartId() {
  const cookieStore = await cookies();
  return cookieStore.get("cartId")?.value;
}

export async function clearCartId() {
  const cookieStore = await cookies();
  cookieStore.delete("cartId");
}
