import { cookies } from "next/headers";

const CART_COOKIE_NAME = "cartId";
const COOKIE_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

export async function getCartIdFromCookies(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(CART_COOKIE_NAME)?.value ?? null;
}

export async function setCartIdInCookies(cartId: string) {
  const cookieStore = await cookies();
  cookieStore.set(CART_COOKIE_NAME, cartId, {
    httpOnly: true,
    path: "/",
    maxAge: COOKIE_AGE_SECONDS,
    sameSite: "lax",
  });
}
