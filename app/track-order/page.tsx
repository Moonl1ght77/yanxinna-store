"use client";

import { useState } from "react";
import { HelpLayout } from "@/components/layout/help-layout";
import { Button } from "@/components/ui/button";

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");

  return (
    <HelpLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-4xl tracking-[0.04em] text-[#2C2825]">Track Your Order</h1>
          <p className="mt-4 text-sm leading-7 text-[#8A7F73]">
            Enter your order number and email to track your shipment.
          </p>
        </div>

        <section className="border border-borderSoft bg-[#FDFBF8] p-6 md:p-8">
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.18em] text-[#A89B8C]">
                Order Number
              </label>
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="e.g., YX12345"
                className="w-full border border-borderSoft bg-white px-4 py-3 text-sm text-[#2C2825] outline-none focus:border-[#5C4E43]"
              />
            </div>
            <div>
              <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.18em] text-[#A89B8C]">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full border border-borderSoft bg-white px-4 py-3 text-sm text-[#2C2825] outline-none focus:border-[#5C4E43]"
              />
            </div>
            <Button className="w-full md:w-auto">Track Order</Button>
          </form>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl tracking-[0.04em] text-[#2C2825]">Order Status Guide</h2>
          <div className="space-y-3 text-sm leading-7 text-[#8A7F73]">
            <div className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#5C4E43]" />
              <div>
                <p className="font-medium text-[#2C2825]">Processing</p>
                <p>Your order is being prepared for shipment.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#A89B8C]" />
              <div>
                <p className="font-medium text-[#2C2825]">Shipped</p>
                <p>Your order is on its way! You&apos;ll receive tracking details via email.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#8A7F73]" />
              <div>
                <p className="font-medium text-[#2C2825]">Delivered</p>
                <p>Your order has arrived.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl tracking-[0.04em] text-[#2C2825]">Didn&apos;t receive tracking?</h2>
          <div className="text-sm leading-7 text-[#8A7F73]">
            <p>
              Tracking information is sent to your email within 24 hours of shipment. Check your spam folder or contact our support team if you need assistance.
            </p>
          </div>
        </section>

        <section className="border-t border-borderSoft pt-8">
          <p className="text-sm leading-7 text-[#8A7F73]">
            <strong className="text-[#2C2825]">Need help?</strong>{" "}
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
