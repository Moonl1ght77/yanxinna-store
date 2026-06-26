"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useCart } from "@/hooks/use-cart";
import { useLocale } from "@/hooks/use-locale";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function CheckoutPageClient() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const { locale, currency, copy } = useLocale();
  const [loading, setLoading] = useState(false);
  const [{ isPending }] = usePayPalScriptReducer();

  const total = useMemo(() => subtotal + (items.length ? 12 : 0), [items.length, subtotal]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setTimeout(() => {
      clearCart();
      router.push(`/checkout/success?order=AB-${Math.floor(Math.random() * 9000 + 1000)}`);
    }, 900);
  };

  const handlePayPalApprove = (data: { orderID: string }) => {
    clearCart();
    router.push(`/checkout/success?order=${data.orderID}`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <div className="mb-6 text-[11px] font-medium uppercase tracking-[0.18em] text-[#8a8077]">
        <Link href="/">{copy.breadcrumbHome}</Link> / <Link href="/cart">{copy.breadcrumbCart}</Link> / {copy.checkoutTitle}
      </div>
      <h1 className="font-display text-5xl tracking-[0.04em] text-[#231f1b]">{copy.checkoutTitle}</h1>
      {items.length === 0 ? (
        <div className="mt-8 border border-borderSoft bg-white p-10">
          <p className="font-display text-3xl tracking-[0.04em] text-[#231f1b]">{copy.cartEmpty}</p>
          <p className="mt-3 max-w-xl text-sm leading-7 text-[#6b635d]">
            {copy.noProductsHint}
          </p>
          <div className="mt-6">
            <Button onClick={() => router.push("/shop")}>{copy.continueShopping}</Button>
          </div>
        </div>
      ) : null}
      {items.length > 0 ? (
        <div className="mt-8 grid gap-8 md:grid-cols-[1.05fr,0.95fr]">
          <div className="border border-borderSoft bg-white p-6 md:p-8">
            <form onSubmit={handleSubmit} className="grid gap-6">
              <div className="grid gap-3 border border-borderSoft bg-[#faf8f5] p-5 text-sm text-[#524a43]">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#8a8077]">Step 1</span>
                  <span>{copy.checkoutShippingLabel}</span>
                </div>
                <div className="flex items-center justify-between border-t border-borderSoft pt-3">
                  <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#8a8077]">Step 2</span>
                  <span>{copy.checkoutPaymentLabel}</span>
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
                <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#8a8077]">{copy.checkoutShippingLabel} address</p>
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
            </form>

            <div className="mt-6 border-t border-borderSoft pt-6">
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#8a8077]">{copy.checkoutPaymentLabel}</p>
              <div className="mt-4">
                {isPending ? (
                  <div className="flex h-12 items-center justify-center border border-borderSoft bg-[#f7f6f4]">
                    <span className="text-sm text-[#6b635d]">Loading PayPal...</span>
                  </div>
                ) : (
                  <PayPalButtons
                    style={{ layout: "vertical", height: 48 }}
                    createOrder={(data, actions) => {
                      return actions.order.create({
                        intent: "CAPTURE",
                        purchase_units: [
                          {
                            amount: {
                              value: total.toFixed(2),
                              currency_code: currency
                            }
                          }
                        ]
                      });
                    }}
                    onApprove={(data, actions) => {
                      return actions.order!.capture().then(() => {
                        handlePayPalApprove(data);
                      });
                    }}
                    onError={(err) => {
                      console.error("PayPal error:", err);
                    }}
                  />
                )}
              </div>
              <p className="mt-4 text-xs leading-5 text-[#8a8077]">
                {copy.stripePlaceholder}
              </p>
            </div>
          </div>

          <div className="border border-borderSoft bg-[#f7f6f4] p-6 md:p-8">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#8a8077]">{copy.orderSummary}</p>
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
                <span>{copy.products}</span>
                <span>{formatPrice(subtotal, currency, locale)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>{copy.shipping}</span>
                <span>{formatPrice(items.length ? 12 : 0, currency, locale)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-[#d8d0c6] pt-3 text-base text-[#231f1b]">
                <span>{copy.total}</span>
                <span>{formatPrice(total, currency, locale)}</span>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
