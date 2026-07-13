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
    <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8 md:px-8">
      <div className="mb-4 text-[10px] font-medium uppercase tracking-[0.18em] text-[#A89B8C] sm:mb-6 sm:text-[11px]">
        <Link href="/">{copy.breadcrumbHome}</Link> / <Link href="/shop">{copy.breadcrumbShop}</Link> / {copy.breadcrumbCart}
      </div>
      <h1 className="font-display text-3xl/[1.15] tracking-[0.04em] text-[#2C2825] sm:text-5xl/[1.15]">{copy.cartTitle}</h1>
      {items.length === 0 ? (
        <div className="mt-6 border border-borderSoft bg-white p-6 sm:mt-8 sm:p-10">
          <p className="text-xs text-[#8A7F73] sm:text-sm">{copy.cartEmpty}</p>
          <Link href="/shop" className="mt-4 inline-block sm:mt-6">
            <Button>{copy.continueShopping}</Button>
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 sm:mt-8 sm:gap-8 md:grid-cols-[1.15fr,0.85fr]">
          <div className="space-y-4 sm:space-y-5">
            {items.map((item) => (
              <div key={item.cartItemId} className="grid gap-3 border border-borderSoft bg-white p-3 sm:gap-4 sm:p-4 md:grid-cols-[180px,1fr]">
                <PlaceholderImage src={item.image} alt={item.name} className="min-h-[140px] rounded-none sm:min-h-[180px]" />
                <div className="flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-3 sm:gap-4">
                      <div>
                        <p className="text-sm font-medium text-[#2C2825] sm:text-lg">{item.name}</p>
                        <p className="mt-1 text-xs text-[#A89B8C] sm:mt-2 sm:text-sm">
                          {item.color} / {item.size}
                        </p>
                      </div>
                      <button onClick={() => removeItem(item.cartItemId)} className="text-[#9a9188] hover:text-[#6B5E52]">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="mt-2 text-xs text-[#6B5E52] sm:mt-4 sm:text-sm">{formatPrice(item.price, currency, locale)}</p>
                  </div>
                  <div className="mt-3 flex items-center gap-3 sm:mt-6 sm:gap-4">
                    <button
                      onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                      className="border border-borderSoft p-1.5 sm:p-2"
                    >
                      <Minus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </button>
                    <span className="min-w-5 text-center text-xs text-[#6B5E52] sm:min-w-6 sm:text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                      className="border border-borderSoft p-1.5 sm:p-2"
                    >
                      <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="border border-borderSoft bg-[#F5F1ED] p-4 sm:p-6 md:p-8">
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#A89B8C] sm:text-[11px]">{copy.orderSummary}</p>
            <div className="mt-4 flex items-center justify-between text-xs text-[#6B5E52] sm:mt-6 sm:text-sm">
              <span>{copy.products}</span>
              <span>{formatPrice(subtotal, currency, locale)}</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-[#6B5E52] sm:mt-4 sm:text-sm">
              <span>{copy.shipping}</span>
              <span>{formatPrice(estimatedShipping, currency, locale)}</span>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-[#d8d0c6] pt-3 text-sm text-[#2C2825] sm:mt-4 sm:pt-4 sm:text-base">
              <span>{copy.total}</span>
              <span>{formatPrice(total, currency, locale)}</span>
            </div>
            <p className="mt-4 text-xs leading-6 text-[#8A7F73] sm:mt-5 sm:text-sm sm:leading-7">
              {copy.cartNote}
            </p>
            <Link href="/shop" className="mt-4 inline-block text-[10px] font-medium uppercase tracking-[0.18em] text-[#6B5E52] sm:mt-6 sm:text-[11px]">
              {copy.continueShopping}
            </Link>
            <Link href="/checkout" className="mt-5 block sm:mt-8">
              <Button className="w-full">{copy.checkout}</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
