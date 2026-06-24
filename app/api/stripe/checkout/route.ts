import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      ready: false,
      message:
        "Stripe Checkout integration is intentionally not connected yet. Replace this route with your real Stripe session creation logic."
    },
    { status: 501 }
  );
}
