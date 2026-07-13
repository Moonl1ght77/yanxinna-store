"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useCart } from "@/hooks/use-cart";
import { useLocale } from "@/hooks/use-locale";
import { formatPrice } from "@/lib/utils";
import { regionOptions } from "@/lib/data/locales";
import { Button } from "@/components/ui/button";

export function CheckoutPageClient() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const { locale, currency, copy } = useLocale();
  const [paymentError, setPaymentError] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [{ isPending }] = usePayPalScriptReducer();

  // 金额以 USD 计价，PayPal 统一按 USD 收款（PayPal 不支持 RUB）
  const total = useMemo(() => subtotal + (items.length ? 12 : 0), [items.length, subtotal]);

  const readShippingForm = () => {
    const form = formRef.current;
    if (!form) return null;
    const data = new FormData(form);
    const get = (key: string) => String(data.get(key) ?? "").trim();
    return {
      email: get("email"),
      firstName: get("firstName"),
      lastName: get("lastName"),
      address1: get("address1"),
      address2: get("address2"),
      city: get("city"),
      postalCode: get("postalCode"),
      country: get("country")
    };
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <div className="mb-6 text-[11px] font-medium uppercase tracking-[0.18em] text-[#A89B8C]">
        <Link href="/">{copy.breadcrumbHome}</Link> / <Link href="/cart">{copy.breadcrumbCart}</Link> / {copy.checkoutTitle}
      </div>
      <h1 className="font-display text-3xl tracking-[0.04em] text-[#2C2825] sm:text-4xl md:text-5xl">{copy.checkoutTitle}</h1>
      {items.length === 0 ? (
        <div className="mt-8 border border-borderSoft bg-white p-10">
          <p className="font-display text-3xl tracking-[0.04em] text-[#2C2825]">{copy.cartEmpty}</p>
          <p className="mt-3 max-w-xl text-sm leading-7 text-[#8A7F73]">
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
            <form ref={formRef} onSubmit={(event) => event.preventDefault()} className="grid gap-6">
              <div className="grid gap-3 border border-borderSoft bg-[#FDFBF8] p-5 text-sm text-[#6B5E52]">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#A89B8C]">Step 1</span>
                  <span>{copy.checkoutShippingLabel}</span>
                </div>
                <div className="flex items-center justify-between border-t border-borderSoft pt-3">
                  <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#A89B8C]">Step 2</span>
                  <span>{copy.checkoutPaymentLabel}</span>
                </div>
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#A89B8C]">Contact</p>
                <div className="mt-4 grid gap-4">
                  <input name="email" type="email" required className="h-12 border border-borderSoft px-4 text-sm text-[#2C2825] outline-none" placeholder="Email address" />
                  <input name="phone" type="tel" className="h-12 border border-borderSoft px-4 text-sm text-[#2C2825] outline-none" placeholder="Phone number" />
                </div>
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#A89B8C]">{copy.checkoutShippingLabel} address</p>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <input name="firstName" required className="h-12 border border-borderSoft px-4 text-sm text-[#2C2825] outline-none" placeholder="First name" />
                  <input name="lastName" required className="h-12 border border-borderSoft px-4 text-sm text-[#2C2825] outline-none" placeholder="Last name" />
                  <input name="address1" required className="h-12 border border-borderSoft px-4 text-sm text-[#2C2825] outline-none md:col-span-2" placeholder="Address line 1" />
                  <input name="address2" className="h-12 border border-borderSoft px-4 text-sm text-[#2C2825] outline-none md:col-span-2" placeholder="Apartment, suite, etc. (optional)" />
                  <input name="city" required className="h-12 border border-borderSoft px-4 text-sm text-[#2C2825] outline-none" placeholder="City" />
                  <input name="postalCode" required className="h-12 border border-borderSoft px-4 text-sm text-[#2C2825] outline-none" placeholder="Postal code" />
                  <select name="country" required defaultValue="" className="h-12 border border-borderSoft bg-white px-4 text-sm text-[#2C2825] outline-none md:col-span-2">
                    <option value="" disabled>
                      Country / Region
                    </option>
                    {regionOptions.map((option) => (
                      <option key={option.region} value={option.region}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </form>

            <div className="mt-6 border-t border-borderSoft pt-6">
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#A89B8C]">{copy.checkoutPaymentLabel}</p>
              <div className="mt-4">
                {isPending ? (
                  <div className="flex h-12 items-center justify-center border border-borderSoft bg-[#F5F1ED]">
                    <span className="text-sm text-[#8A7F73]">Loading PayPal...</span>
                  </div>
                ) : (
                  <PayPalButtons
                    style={{ layout: "vertical", height: 48 }}
                    onClick={(_, actions) => {
                      setPaymentError(false);
                      if (formRef.current?.reportValidity()) {
                        return actions.resolve();
                      }
                      return actions.reject();
                    }}
                    createOrder={(data, actions) => {
                      const shipping = readShippingForm();
                      return actions.order.create({
                        intent: "CAPTURE",
                        payer: shipping?.email ? { email_address: shipping.email } : undefined,
                        purchase_units: [
                          {
                            amount: {
                              value: total.toFixed(2),
                              currency_code: "USD"
                            },
                            shipping: shipping
                              ? {
                                  name: { full_name: `${shipping.firstName} ${shipping.lastName}` },
                                  address: {
                                    address_line_1: shipping.address1,
                                    address_line_2: shipping.address2 || undefined,
                                    admin_area_2: shipping.city,
                                    postal_code: shipping.postalCode,
                                    country_code: shipping.country
                                  }
                                }
                              : undefined
                          }
                        ],
                        application_context: {
                          shipping_preference: shipping ? "SET_PROVIDED_ADDRESS" : "GET_FROM_FILE"
                        }
                      });
                    }}
                    onApprove={(data, actions) => {
                      return actions.order!.capture().then(() => {
                        clearCart();
                        router.push(`/checkout/success?order=${data.orderID}`);
                      });
                    }}
                    onError={(err) => {
                      console.error("PayPal error:", err);
                      setPaymentError(true);
                    }}
                  />
                )}
              </div>
              {paymentError ? (
                <p className="mt-3 text-xs leading-5 text-red-600">{copy.paymentError}</p>
              ) : null}
              <p className="mt-4 text-xs leading-5 text-[#A89B8C]">
                {copy.paymentUsdNote}
              </p>
            </div>
          </div>

          <div className="border border-borderSoft bg-[#F5F1ED] p-6 md:p-8">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#A89B8C]">{copy.orderSummary}</p>
            <div className="mt-6 space-y-4">
              {items.map((item) => (
                <div key={item.cartItemId} className="flex items-center justify-between gap-4 border-b border-[#e5ddd3] pb-4 text-sm text-[#6B5E52]">
                  <div>
                    <p>{item.name}</p>
                    <p className="mt-1 text-xs text-[#A89B8C]">
                      {item.color} / {item.size} / Qty {item.quantity}
                    </p>
                  </div>
                  <span>{formatPrice(item.price * item.quantity, currency, locale)}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-3 text-sm text-[#6B5E52]">
              <div className="flex items-center justify-between">
                <span>{copy.products}</span>
                <span>{formatPrice(subtotal, currency, locale)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>{copy.shipping}</span>
                <span>{formatPrice(items.length ? 12 : 0, currency, locale)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-[#d8d0c6] pt-3 text-base text-[#2C2825]">
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
