"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";

export function CheckoutSuccessClient({ order }: { order: string }) {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center md:px-8">
      <div className="border border-borderSoft bg-white px-6 py-14 md:px-10">
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#8a8077]">Order confirmed</p>
        <h1 className="mt-4 font-display text-5xl tracking-[0.04em] text-[#231f1b]">Thank you for your order.</h1>
        <p className="mt-5 text-base leading-8 text-[#6b635d]">
          Your mock payment was successful. Order reference: <span className="font-medium text-[#231f1b]">{order}</span>.
        </p>
        <div className="mt-8 grid gap-4 border border-borderSoft bg-[#faf8f5] p-5 text-left text-sm leading-7 text-[#6b635d]">
          <p>
            A confirmation email would normally be sent here once Stripe, order storage, and fulfillment integrations are connected.
          </p>
          <p>
            This mock flow already clears the cart and preserves the final order reference so the success state behaves like a real storefront.
          </p>
        </div>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/shop">
            <Button>Continue Shopping</Button>
          </Link>
          <Link href="/">
            <Button variant="secondary">Back to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
