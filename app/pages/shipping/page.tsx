"use client";

import { HelpLayout } from "@/components/layout/help-layout";

export default function ShippingPage() {
  return (
    <HelpLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-4xl tracking-[0.04em] text-[#231f1b]">Shipping</h1>
          <p className="mt-4 text-sm leading-7 text-[#6b635d]">
            Fast, reliable delivery to your doorstep.
          </p>
        </div>

        <section className="space-y-4">
          <h2 className="font-display text-2xl tracking-[0.04em] text-[#231f1b]">Russia</h2>
          <div className="space-y-3 text-sm leading-7 text-[#6b635d]">
            <div className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#231f1b]" />
              <div>
                <p className="font-medium text-[#231f1b]">Standard Shipping — Free over 12,000 ₽</p>
                <p>3-5 business days</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#8a8077]" />
              <div>
                <p className="font-medium text-[#231f1b]">Express Shipping — 450 ₽</p>
                <p>1-2 business days</p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl tracking-[0.04em] text-[#231f1b]">International</h2>
          <div className="space-y-3 text-sm leading-7 text-[#6b635d]">
            <div className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#231f1b]" />
              <div>
                <p className="font-medium text-[#231f1b]">Standard International — $15</p>
                <p>7-14 business days</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#8a8077]" />
              <div>
                <p className="font-medium text-[#231f1b]">Express International — $30</p>
                <p>3-5 business days</p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl tracking-[0.04em] text-[#231f1b]">Order Processing</h2>
          <div className="text-sm leading-7 text-[#6b635d]">
            <p>
              Orders placed before 2:00 PM MSK are processed the same day. Orders placed after 2:00 PM or on weekends will be processed the next business day.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl tracking-[0.04em] text-[#231f1b]">Customs & Duties</h2>
          <div className="text-sm leading-7 text-[#6b635d]">
            <p>
              For international orders, customs duties and taxes may apply depending on your country&apos;s regulations. These charges are the responsibility of the customer.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl tracking-[0.04em] text-[#231f1b]">Delivery Partners</h2>
          <div className="text-sm leading-7 text-[#6b635d]">
            <p>
              We partner with trusted carriers including CDEK, Boxberry, and DHL for reliable delivery across Russia and internationally.
            </p>
          </div>
        </section>

        <section className="border-t border-borderSoft pt-8">
          <p className="text-sm leading-7 text-[#6b635d]">
            <strong className="text-[#231f1b]">Questions about shipping?</strong>{" "}
            Contact our support team at{" "}
            <a href="mailto:support@yanxinna.com" className="underline hover:text-[#231f1b]">
              support@yanxinna.com
            </a>
          </p>
        </section>
      </div>
    </HelpLayout>
  );
}
