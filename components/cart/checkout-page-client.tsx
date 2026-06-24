"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/use-cart";
import { useLocale } from "@/hooks/use-locale";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function CheckoutPageClient() {
  const router = useRouter();
  const { items, subtotal } = useCart();
  const { locale, currency, copy } = useLocale();
  const [loading, setLoading] = useState(false);

  const total = useMemo(() => subtotal + (items.length ? 12 : 0), [items.length, subtotal]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setTimeout(() => {
      router.push(`/checkout/success?order=AB-${Math.floor(Math.random() * 9000 + 1000)}`);
    }, 900);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <div className="mb-6 text-[11px] font-medium uppercase tracking-[0.18em] text-[#8a8077]">
        <Link href="/">Home</Link> / <Link href="/cart">Cart</Link> / Checkout
      </div>
      <h1 className="font-display text-5xl tracking-[0.04em] text-[#231f1b]">{copy.checkoutTitle}</h1>
      {items.length === 0 ? (
        <div className="mt-8 border border-borderSoft bg-white p-10">
          <p className="font-display text-3xl tracking-[0.04em] text-[#231f1b]">Your cart is empty.</p>
          <p className="mt-3 max-w-xl text-sm leading-7 text-[#6b635d]">
            Add products before checkout so the order summary and mock payment flow can complete properly.
          </p>
          <div className="mt-6">
            <Button onClick={() => router.push("/shop")}>Back to Shop</Button>
          </div>
        </div>
      ) : null}
      {items.length > 0 ? (
        <div className="mt-8 grid gap-8 md:grid-cols-[1.05fr,0.95fr]">
          <form onSubmit={handleSubmit} className="border border-borderSoft bg-white p-6 md:p-8">
            <div className="grid gap-6">
              <div className="grid gap-3 border border-borderSoft bg-[#faf8f5] p-5 text-sm text-[#524a43]">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#8a8077]">Step 1</span>
                  <span>Contact + Delivery</span>
                </div>
                <div className="flex items-center justify-between border-t border-borderSoft pt-3">
                  <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#8a8077]">Step 2</span>
                  <span>Mock Payment</span>
                </div>
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#8a8077]">Contact</p>
                <div className="mt-4 grid gap-4">
                  <input required className="h-12 border border-borderSoft px-4 text-sm text-[#231f1b] outline-none" placeholder="Email address" />
                  <input className="h-12 border border-borderSoft px-4 text-sm text-[#231f1b] outline-none" placeholder="Phone number" />
                </div>
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#8a8077]">Shipping address</p>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <input required className="h-12 border border-borderSoft px-4 text-sm text-[#231f1b] outline-none" placeholder="First name" />
                  <input required className="h-12 border border-borderSoft px-4 text-sm text-[#231f1b] outline-none" placeholder="Last name" />
                  <input required className="h-12 border border-borderSoft px-4 text-sm text-[#231f1b] outline-none md:col-span-2" placeholder="Address line 1" />
                  <input className="h-12 border border-borderSoft px-4 text-sm text-[#231f1b] outline-none md:col-span-2" placeholder="Apartment, suite, etc. (optional)" />
                  <input required className="h-12 border border-borderSoft px-4 text-sm text-[#231f1b] outline-none" placeholder="City" />
                  <input required className="h-12 border border-borderSoft px-4 text-sm text-[#231f1b] outline-none" placeholder="Postal code" />
                  <input required className="h-12 border border-borderSoft px-4 text-sm text-[#231f1b] outline-none md:col-span-2" placeholder="Country / Region" />
                </div>
              </div>
              <div className="border border-borderSoft bg-[#f7f6f4] p-5">
                <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#8a8077]">Payment</p>
                <p className="mt-3 text-sm leading-7 text-[#6b635d]">
                  {copy.stripePlaceholder}. This mock flow will redirect to a success page while keeping the Stripe route ready for future implementation.
                </p>
              </div>
              <Button type="submit" className="w-full" disabled={loading || items.length === 0}>
                {loading ? "Processing..." : copy.mockPayment}
              </Button>
            </div>
          </form>

          <div className="border border-borderSoft bg-[#f7f6f4] p-6 md:p-8">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#8a8077]">Order Summary</p>
            <div className="mt-6 space-y-4">
              {items.map((item) => (
                <div key={item.cartItemId} className="flex items-center justify-between gap-4 border-b border-[#e5ddd3] pb-4 text-sm text-[#524a43]">
                  <div>
                    <p>{item.name}</p>
                    <p className="mt-1 text-xs text-[#8a8077]">
                      {item.color} / {item.size} / Qty {item.quantity}
                    </p>
                  </div>
                  <span>{formatPrice(item.price * item.quantity, currency, locale)}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-3 text-sm text-[#524a43]">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal, currency, locale)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Shipping</span>
                <span>{formatPrice(items.length ? 12 : 0, currency, locale)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-[#d8d0c6] pt-3 text-base text-[#231f1b]">
                <span>Total</span>
                <span>{formatPrice(total, currency, locale)}</span>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
