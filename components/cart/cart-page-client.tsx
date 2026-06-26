"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useLocale } from "@/hooks/use-locale";
import { formatPrice } from "@/lib/utils";
import { PlaceholderImage } from "@/components/ui/placeholder-image";
import { Button } from "@/components/ui/button";

export function CartPageClient() {
  const { items, subtotal, updateQuantity, removeItem } = useCart();
  const { locale, currency, copy } = useLocale();
  const estimatedShipping = items.length ? 12 : 0;
  const total = subtotal + estimatedShipping;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <div className="mb-6 text-[11px] font-medium uppercase tracking-[0.18em] text-[#8a8077]">
        <Link href="/">{copy.breadcrumbHome}</Link> / <Link href="/shop">{copy.breadcrumbShop}</Link> / {copy.breadcrumbCart}
      </div>
      <h1 className="font-display text-5xl tracking-[0.04em] text-[#231f1b]">{copy.cartTitle}</h1>
      {items.length === 0 ? (
        <div className="mt-8 border border-borderSoft bg-white p-10">
          <p className="text-sm text-[#6b635d]">{copy.cartEmpty}</p>
          <Link href="/shop" className="mt-6 inline-block">
            <Button>{copy.continueShopping}</Button>
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 md:grid-cols-[1.15fr,0.85fr]">
          <div className="space-y-5">
            {items.map((item) => (
              <div key={item.cartItemId} className="grid gap-4 border border-borderSoft bg-white p-4 md:grid-cols-[180px,1fr]">
                <PlaceholderImage src={item.image} alt={item.name} className="min-h-[180px] rounded-none" />
                <div className="flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-lg text-[#231f1b]">{item.name}</p>
                        <p className="mt-2 text-sm text-[#8a8077]">
                          {item.color} / {item.size}
                        </p>
                      </div>
                      <button onClick={() => removeItem(item.cartItemId)} className="text-[#9a9188] hover:text-[#524a43]">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="mt-4 text-sm text-[#524a43]">{formatPrice(item.price, currency, locale)}</p>
                  </div>
                  <div className="mt-6 flex items-center gap-4">
                    <button
                      onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                      className="border border-borderSoft p-2"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="text-sm text-[#524a43]">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                      className="border border-borderSoft p-2"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="border border-borderSoft bg-[#f7f6f4] p-6 md:p-8">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#8a8077]">{copy.orderSummary}</p>
            <div className="mt-6 flex items-center justify-between text-sm text-[#524a43]">
              <span>{copy.products}</span>
              <span>{formatPrice(subtotal, currency, locale)}</span>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm text-[#524a43]">
              <span>{copy.shipping}</span>
              <span>{formatPrice(estimatedShipping, currency, locale)}</span>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-[#d8d0c6] pt-4 text-base text-[#231f1b]">
              <span>{copy.total}</span>
              <span>{formatPrice(total, currency, locale)}</span>
            </div>
            <p className="mt-5 text-sm leading-7 text-[#6b635d]">
              {copy.cartNote}
            </p>
            <Link href="/shop" className="mt-6 inline-block text-[11px] font-medium uppercase tracking-[0.18em] text-[#524a43]">
              {copy.continueShopping}
            </Link>
            <Link href="/checkout" className="mt-8 block">
              <Button className="w-full">{copy.checkout}</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
