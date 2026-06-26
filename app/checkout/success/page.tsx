"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CheckoutSuccessClient } from "@/components/cart/checkout-success-client";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const order = searchParams.get("order") ?? "AB-1001";
  return <CheckoutSuccessClient order={order} />;
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
