"use server";

import { cookies } from "next/headers";
import { api } from "~/trpc/server";

export async function getCartId() {
  const cookieStore = await cookies();
  return cookieStore.get("cartId")?.value;
}

export async function getCart() {
  const cartId = await getCartId();
  if (!cartId) {
    return null;
  }
  return await api.cart.get(cartId);
}

export async function createCart() {
  const cart = await api.cart.create();
  const cartId = await setCartId(cart.data.id);
  return cart.data;
}

export async function addToCart({
  variantId,
  quantity,
}: {
  variantId: string;
  quantity: number;
}) {
  const cartId = await getCartId();
  if (!cartId) {
    return null;
  }
  const updateCart = await api.cart.update({
    cartId: cartId ?? "",
    variantId: variantId,
    quantity: quantity,
  });

  return updateCart.data;
}

export async function getYeetId() {
  const cookieStore = await cookies();
  return cookieStore.get("yeetId")?.value;
}

export async function setCartId(cartId: string) {
  const cookieStore = await cookies();
  cookieStore.set("cartId", cartId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

export async function clearCartId() {
  const cookieStore = await cookies();
  cookieStore.delete("cartId");
}

export async function setRandom() {
  const cookieStore = await cookies();
  const randomWord = Math.random().toString(36).substring(2, 15);
  cookieStore.set("yeetId", randomWord, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}
