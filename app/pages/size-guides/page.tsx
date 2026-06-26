"use client";

import { HelpLayout } from "@/components/layout/help-layout";

export default function SizeGuidePage() {
  return (
    <HelpLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-4xl tracking-[0.04em] text-[#231f1b]">Size Guide</h1>
          <p className="mt-4 text-sm leading-7 text-[#6b635d]">
            Find your perfect fit with our comprehensive size chart.
          </p>
        </div>

        <section className="space-y-4">
          <h2 className="font-display text-2xl tracking-[0.04em] text-[#231f1b]">How to Measure</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { title: "Bust", desc: "Measure around the fullest part of your bust, keeping the tape level." },
              { title: "Waist", desc: "Measure around your natural waistline, the narrowest part of your torso." },
              { title: "Hips", desc: "Measure around the fullest part of your hips and buttocks." }
            ].map((item) => (
              <div key={item.title} className="border border-borderSoft bg-[#faf8f5] p-4">
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#231f1b]">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-[#6b635d]">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl tracking-[0.04em] text-[#231f1b]">Shapewear Size Chart</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-borderSoft">
                  <th className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-[0.18em] text-[#8a8077]">Size</th>
                  <th className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-[0.18em] text-[#8a8077]">Bust (cm)</th>
                  <th className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-[0.18em] text-[#8a8077]">Waist (cm)</th>
                  <th className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-[0.18em] text-[#8a8077]">Hips (cm)</th>
                </tr>
              </thead>
              <tbody className="text-sm text-[#6b635d]">
                {[
                  { size: "XS", bust: "80-84", waist: "60-64", hips: "86-90" },
                  { size: "S", bust: "84-88", waist: "64-68", hips: "90-94" },
                  { size: "M", bust: "88-92", waist: "68-72", hips: "94-98" },
                  { size: "L", bust: "92-96", waist: "72-76", hips: "98-102" },
                  { size: "XL", bust: "96-100", waist: "76-80", hips: "102-106" },
                  { size: "XXL", bust: "100-104", waist: "80-84", hips: "106-110" }
                ].map((row) => (
                  <tr key={row.size} className="border-b border-borderSoft">
                    <td className="px-4 py-3 font-medium text-[#231f1b]">{row.size}</td>
                    <td className="px-4 py-3">{row.bust}</td>
                    <td className="px-4 py-3">{row.waist}</td>
                    <td className="px-4 py-3">{row.hips}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl tracking-[0.04em] text-[#231f1b]">Bra Size Chart</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-borderSoft">
                  <th className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-[0.18em] text-[#8a8077]">Size</th>
                  <th className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-[0.18em] text-[#8a8077]">Underbust (cm)</th>
                  <th className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-[0.18em] text-[#8a8077]">Bust (cm)</th>
                </tr>
              </thead>
              <tbody className="text-sm text-[#6b635d]">
                {[
                  { size: "70A", underbust: "68-72", bust: "80-84" },
                  { size: "75B", underbust: "73-77", bust: "88-92" },
                  { size: "80C", underbust: "78-82", bust: "96-100" },
                  { size: "85B", underbust: "83-87", bust: "92-96" },
                  { size: "90C", underbust: "88-92", bust: "100-104" }
                ].map((row) => (
                  <tr key={row.size} className="border-b border-borderSoft">
                    <td className="px-4 py-3 font-medium text-[#231f1b]">{row.size}</td>
                    <td className="px-4 py-3">{row.underbust}</td>
                    <td className="px-4 py-3">{row.bust}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl tracking-[0.04em] text-[#231f1b]">Sizing Tips</h2>
          <div className="space-y-3 text-sm leading-7 text-[#6b635d]">
            <ul className="list-inside list-disc space-y-1">
              <li>If you&apos;re between sizes, we recommend sizing up for a more comfortable fit.</li>
              <li>Shapewear should feel snug but not restrictive.</li>
              <li>Measure yourself while wearing lightweight undergarments for the most accurate results.</li>
              <li>For personalized advice, contact our styling team at support@yanxinna.com</li>
            </ul>
          </div>
        </section>
      </div>
    </HelpLayout>
  );
}
