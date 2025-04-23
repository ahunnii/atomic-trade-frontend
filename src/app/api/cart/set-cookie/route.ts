import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { cartId: string };
    const { cartId } = body;

    if (!cartId) {
      return NextResponse.json(
        { error: "Cart ID is required" },
        { status: 400 },
      );
    }

    // Set the cookie directly using the Cookie Store API
    const cookieStore = await cookies();
    cookieStore.set({
      name: "cartId",
      value: cartId,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(
      "Error setting cart cookie:",
      error instanceof Error ? error.message : "Unknown error",
    );
    return NextResponse.json(
      { error: "Failed to set cart cookie" },
      { status: 500 },
    );
  }
}

export async function DELETE() {
  try {
    // Delete the cookie directly using the Cookie Store API
    const cookieStore = await cookies();
    cookieStore.delete("cartId");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(
      "Error deleting cart cookie:",
      error instanceof Error ? error.message : "Unknown error",
    );
    return NextResponse.json(
      { error: "Failed to delete cart cookie" },
      { status: 500 },
    );
  }
}
