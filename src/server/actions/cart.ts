"use server";

import { cookies } from "next/headers";

export async function getCartId() {
  const cookieStore = await cookies();
  return cookieStore.get("cartId")?.value;
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
