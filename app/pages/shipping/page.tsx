"use client";

import { HelpLayout } from "@/components/layout/help-layout";

export default function ShippingPage() {
  return (
    <HelpLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-4xl tracking-[0.04em] text-[#2C2825]">Shipping</h1>
          <p className="mt-4 text-sm leading-7 text-[#8A7F73]">
            Fast, reliable delivery to your doorstep.
          </p>
        </div>

        <section className="space-y-4">
          <h2 className="font-display text-2xl tracking-[0.04em] text-[#2C2825]">Russia</h2>
          <div className="space-y-3 text-sm leading-7 text-[#8A7F73]">
            <div className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#5C4E43]" />
              <div>
                <p className="font-medium text-[#2C2825]">Standard Shipping — Free over 12,000 ₽</p>
                <p>3-5 business days</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#A89B8C]" />
              <div>
                <p className="font-medium text-[#2C2825]">Express Shipping — 450 ₽</p>
                <p>1-2 business days</p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl tracking-[0.04em] text-[#2C2825]">International</h2>
          <div className="space-y-3 text-sm leading-7 text-[#8A7F73]">
            <div className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#5C4E43]" />
              <div>
                <p className="font-medium text-[#2C2825]">Standard International — $15</p>
                <p>7-14 business days</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#A89B8C]" />
              <div>
                <p className="font-medium text-[#2C2825]">Express International — $30</p>
                <p>3-5 business days</p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl tracking-[0.04em] text-[#2C2825]">Order Processing</h2>
          <div className="text-sm leading-7 text-[#8A7F73]">
            <p>
              Orders placed before 2:00 PM MSK are processed the same day. Orders placed after 2:00 PM or on weekends will be processed the next business day.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl tracking-[0.04em] text-[#2C2825]">Customs & Duties</h2>
          <div className="text-sm leading-7 text-[#8A7F73]">
            <p>
              For international orders, customs duties and taxes may apply depending on your country&apos;s regulations. These charges are the responsibility of the customer.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl tracking-[0.04em] text-[#2C2825]">Delivery Partners</h2>
          <div className="text-sm leading-7 text-[#8A7F73]">
            <p>
              We partner with trusted carriers including CDEK, Boxberry, and DHL for reliable delivery across Russia and internationally.
            </p>
          </div>
        </section>

        <section className="border-t border-borderSoft pt-8">
          <p className="text-sm leading-7 text-[#8A7F73]">
            <strong className="text-[#2C2825]">Questions about shipping?</strong>{" "}
            Contact our support team at{" "}
            <a href="mailto:13719947765@139.com" className="underline hover:text-[#2C2825]">
              13719947765@139.com
            </a>
          </p>
        </section>
      </div>
    </HelpLayout>
  );
}
