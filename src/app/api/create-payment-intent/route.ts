import { NextRequest, NextResponse } from "next/server";

import { stripeClient } from "@atomic-trade/payments";

export async function POST(request: NextRequest) {
  try {
    const { amountInCents } = (await request.json()) as {
      amountInCents: number;
    };

    const paymentIntent = await stripeClient?.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    return NextResponse.json({ clientSecret: paymentIntent?.client_secret });
  } catch (error) {
    console.error("Internal Error:", error);
    // Handle other errors (e.g., network issues, parsing errors)
    return NextResponse.json(
      {
        error: `Internal Server Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      },
      { status: 500 },
    );
  }
}
