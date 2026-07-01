"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/hooks/use-cart";
import { useLocale } from "@/hooks/use-locale";
import { Button } from "@/components/ui/button";

export function CheckoutSuccessClient({ order }: { order: string }) {
  const { clearCart } = useCart();
  const { copy } = useLocale();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center md:px-8">
      <div className="border border-borderSoft bg-white px-6 py-14 md:px-10">
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#A89B8C]">{copy.orderConfirmed}</p>
        <h1 className="mt-4 font-display text-3xl tracking-[0.04em] text-[#2C2825] sm:text-4xl md:text-5xl">{copy.orderThankYou}</h1>
        <p className="mt-5 text-base leading-8 text-[#8A7F73]">
          {copy.orderReference}: <span className="font-medium text-[#2C2825]">{order}</span>.
        </p>
        <div className="mt-8 grid gap-4 border border-borderSoft bg-[#FDFBF8] p-5 text-left text-sm leading-7 text-[#8A7F73]">
          <p>{copy.orderConfirmationNote}</p>
          <p>{copy.orderMockFlowNote}</p>
        </div>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/shop">
            <Button>{copy.continueShopping}</Button>
          </Link>
          <Link href="/">
            <Button variant="secondary">{copy.breadcrumbHome}</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
