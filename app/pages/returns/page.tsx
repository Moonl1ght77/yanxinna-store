"use client";

import { HelpLayout } from "@/components/layout/help-layout";

export default function ReturnsPage() {
  return (
    <HelpLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-4xl tracking-[0.04em] text-[#2C2825]">Returns & Exchanges</h1>
          <p className="mt-4 text-sm leading-7 text-[#8A7F73]">
            We want you to love your YANXINNA pieces. If something isn&apos;t right, we&apos;re here to help.
          </p>
        </div>

        <section className="space-y-4">
          <h2 className="font-display text-2xl tracking-[0.04em] text-[#2C2825]">Return Policy</h2>
          <div className="space-y-3 text-sm leading-7 text-[#8A7F73]">
            <p>
              You may return most items within <strong className="text-[#2C2825]">30 days</strong> of delivery for a full refund.
              Items must be in original condition with tags attached.
            </p>
            <p>
              Returns are free for orders within Russia. For international orders, return shipping costs are the responsibility of the customer.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl tracking-[0.04em] text-[#2C2825]">How to Return</h2>
          <div className="space-y-4">
            {[
              { step: "1", title: "Start your return", desc: "Contact our support team with your order number and reason for return." },
              { step: "2", title: "Get your label", desc: "We&apos;ll send you a prepaid return label via email within 24 hours." },
              { step: "3", title: "Pack it up", desc: "Place the item(s) in the original packaging or a secure mailer." },
              { step: "4", title: "Drop it off", desc: "Drop off your package at any authorized shipping location." }
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-[#5C4E43] text-[11px] font-medium text-[#2C2825]">
                  {item.step}
                </div>
                <div>
                  <p className="text-sm font-medium text-[#2C2825]">{item.title}</p>
                  <p className="mt-1 text-sm leading-6 text-[#8A7F73]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl tracking-[0.04em] text-[#2C2825]">Exchanges</h2>
          <div className="text-sm leading-7 text-[#8A7F73]">
            <p>
              Need a different size? We offer free exchanges within 30 days. Simply initiate a return and place a new order for your preferred size.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl tracking-[0.04em] text-[#2C2825]">Non-Returnable Items</h2>
          <div className="text-sm leading-7 text-[#8A7F73]">
            <p>The following items cannot be returned:</p>
            <ul className="mt-3 list-inside list-disc space-y-1">
              <li>Items without original tags</li>
              <li>Items that have been worn, washed, or altered</li>
              <li>Final sale items (marked as &quot;Final Sale&quot;)</li>
              <li>Gift cards</li>
            </ul>
          </div>
        </section>

        <section className="border-t border-borderSoft pt-8">
          <p className="text-sm leading-7 text-[#8A7F73]">
            <strong className="text-[#2C2825]">Questions about returns?</strong>{" "}
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
