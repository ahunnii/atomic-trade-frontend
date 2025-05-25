// app/api/cart/start/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { env } from "~/env";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

export async function GET() {
  const cookieStore = await cookies();
  const existingCartId = cookieStore.get("cartId")?.value;

  // If cart ID exists, return early
  if (existingCartId) {
    return NextResponse.json({ success: true });
  }

  const session = await auth();
  const email = session?.user?.email;

  // If no user is logged in, create a new guest cart
  if (!email) {
    const storeSlug = env.STORE_NAME.toLowerCase().replace(/ /g, "-");
    const store = await db.store.findFirst({
      where: { slug: storeSlug },
    });

    if (!store) {
      throw new Error("Store not set up yet.");
    }

    const newCart = await db.cart.create({
      data: { storeId: store.id },
    });

    cookieStore.set("cartId", newCart.id, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "lax",
    });

    return NextResponse.json({ success: true });
  }

  // User is logged in - check for existing customer cart
  const customer = await db.customer.findFirst({
    where: { email },
    include: { cart: true },
  });

  if (customer?.cart) {
    // Set cookie to existing customer cart
    cookieStore.set("cartId", customer.cart.id, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "lax",
    });
  } else {
    // Create new cart for customer
    const storeSlug = env.STORE_NAME.toLowerCase().replace(/ /g, "-");
    const store = await db.store.findFirst({
      where: { slug: storeSlug },
    });

    if (!store) {
      throw new Error("Store not set up yet.");
    }

    const newCart = await db.cart.create({
      data: {
        storeId: store.id,
        customerId: customer?.id,
      },
    });

    cookieStore.set("cartId", newCart.id, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "lax",
    });
  }

  return NextResponse.json({ success: true });
}
