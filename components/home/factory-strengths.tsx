"use client";

import { useState } from "react";
import Image from "next/image";
import { useLocale } from "@/hooks/use-locale";
import { BorderGlow } from "@/components/ui/border-glow";

export function FactoryStrengths() {
  const { copy } = useLocale();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    copy.faq1,
    copy.faq2,
    copy.faq3,
    copy.faq4,
    copy.faq5,
    copy.faq6,
    copy.faq7
  ];

  return (
    <div className="w-full">
      {/* 1. Capabilities & Services - White */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 md:px-8 md:py-20">
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-[#A89B8C]">Capabilities & Services</p>
        <h2 className="mt-4 max-w-4xl text-2xl font-bold leading-tight tracking-[0.01em] text-[#2C2825] sm:text-3xl md:text-4xl">
          {copy.capabilitiesTitle}
        </h2>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[#8A7F73]">{copy.capabilitiesSubtitle}</p>

        <div className="mt-10 space-y-12">
          {/* 01 Quality */}
          <div className="grid gap-8 md:grid-cols-[1fr,2fr]">
            <div className="relative min-h-[200px] overflow-hidden bg-[#F5F1ED] md:min-h-[300px]">
              <div className="absolute left-4 top-4 z-10 rounded bg-[#A89B8C] px-3 py-1 text-xs font-medium text-white">01</div>
              <Image
                src="/factory-1.png"
                alt="Quality Control"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <div>
              <h3 className="text-lg font-medium text-[#2C2825]">{copy.cap01Title}</h3>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {[
                  { title: copy.cap01Item1, desc: copy.cap01Item1Desc },
                  { title: copy.cap01Item2, desc: copy.cap01Item2Desc },
                  { title: copy.cap01Item3, desc: copy.cap01Item3Desc }
                ].map((item) => (
                  <BorderGlow key={item.title} backgroundColor="#ffffff" borderRadius={12} glowRadius={30}>
                    <div className="p-4">
                      <p className="text-sm font-medium text-[#2C2825]">{item.title}</p>
                      <p className="mt-2 text-xs leading-5 text-[#8A7F73]">{item.desc}</p>
                    </div>
                  </BorderGlow>
                ))}
              </div>
            </div>
          </div>

          {/* 02 Style Development */}
          <div className="grid gap-8 md:grid-cols-[2fr,1fr]">
            <div>
              <h3 className="text-lg font-medium text-[#2C2825]">{copy.cap02Title}</h3>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {[
                  { title: copy.cap02Item1, desc: copy.cap02Item1Desc },
                  { title: copy.cap02Item2, desc: copy.cap02Item2Desc },
                  { title: copy.cap02Item3, desc: copy.cap02Item3Desc }
                ].map((item) => (
                  <BorderGlow key={item.title} backgroundColor="#ffffff" borderRadius={12} glowRadius={30}>
                    <div className="p-4">
                      <p className="text-sm font-medium text-[#2C2825]">{item.title}</p>
                      <p className="mt-2 text-xs leading-5 text-[#8A7F73]">{item.desc}</p>
                    </div>
                  </BorderGlow>
                ))}
              </div>
            </div>
            <div className="relative min-h-[200px] overflow-hidden bg-[#F5F1ED] md:min-h-[300px]">
              <div className="absolute left-4 top-4 z-10 rounded bg-[#A89B8C] px-3 py-1 text-xs font-medium text-white">02</div>
              <Image
                src="/factory-2.png"
                alt="Style Development"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          </div>

          {/* 03 Fast Launch */}
          <div className="grid gap-8 md:grid-cols-[1fr,2fr]">
            <div className="relative min-h-[200px] overflow-hidden bg-[#F5F1ED] md:min-h-[300px]">
              <div className="absolute left-4 top-4 z-10 rounded bg-[#A89B8C] px-3 py-1 text-xs font-medium text-white">03</div>
              <Image
                src="/factory-3.png"
                alt="Fast Launch"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <div>
              <h3 className="text-lg font-medium text-[#2C2825]">{copy.cap03Title}</h3>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {[
                  { title: copy.cap03Item1, desc: copy.cap03Item1Desc },
                  { title: copy.cap03Item2, desc: copy.cap03Item2Desc },
                  { title: copy.cap03Item3, desc: copy.cap03Item3Desc }
                ].map((item) => (
                  <BorderGlow key={item.title} backgroundColor="#ffffff" borderRadius={12} glowRadius={30}>
                    <div className="p-4">
                      <p className="text-sm font-medium text-[#2C2825]">{item.title}</p>
                      <p className="mt-2 text-xs leading-5 text-[#8A7F73]">{item.desc}</p>
                    </div>
                  </BorderGlow>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Partnership Models - Light Blue Gradient */}
      <section className="bg-gradient-to-b from-[#F0EBE5] to-[#FDFBF8] px-4 py-12 sm:px-6 sm:py-16 md:px-8 md:py-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-[#A89B8C]">Partnership Models</p>
          <h2 className="mt-4 max-w-4xl text-2xl font-bold leading-tight tracking-[0.01em] text-[#2C2825] sm:text-3xl md:text-4xl">
            {copy.partnershipTitle}
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[#8A7F73]">{copy.partnershipSubtitle}</p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {/* Model 01 */}
            <BorderGlow backgroundColor="#ffffff" borderRadius={12} glowRadius={30}>
              <div className="p-6">
                <p className="text-4xl font-bold text-[#A89B8C]">01</p>
                <h3 className="mt-4 text-lg font-medium text-[#2C2825]">{copy.partnership01Title}</h3>
                <p className="mt-1 text-xs font-medium text-[#A89B8C]">{copy.partnership01Subtitle}</p>
                <p className="mt-4 text-xs leading-6 text-[#8A7F73]">{copy.partnership01Desc}</p>
                <ul className="mt-4 space-y-2">
                  {copy.partnership01Features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-[#8A7F73]">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#A89B8C]" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </BorderGlow>

            {/* Model 02 */}
            <BorderGlow backgroundColor="#ffffff" borderRadius={12} glowRadius={30}>
              <div className="p-6">
                <p className="text-4xl font-bold text-[#A89B8C]">02</p>
                <h3 className="mt-4 text-lg font-medium text-[#2C2825]">{copy.partnership02Title}</h3>
                <p className="mt-1 text-xs font-medium text-[#A89B8C]">{copy.partnership02Subtitle}</p>
                <p className="mt-4 text-xs leading-6 text-[#8A7F73]">{copy.partnership02Desc}</p>
                <ul className="mt-4 space-y-2">
                  {copy.partnership02Features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-[#8A7F73]">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#A89B8C]" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </BorderGlow>

            {/* Model 03 */}
            <BorderGlow backgroundColor="#ffffff" borderRadius={12} glowRadius={30}>
              <div className="p-6">
                <p className="text-4xl font-bold text-[#A89B8C]">03</p>
                <h3 className="mt-4 text-lg font-medium text-[#2C2825]">{copy.partnership03Title}</h3>
                <p className="mt-1 text-xs font-medium text-[#A89B8C]">{copy.partnership03Subtitle}</p>
                <p className="mt-4 text-xs leading-6 text-[#8A7F73]">{copy.partnership03Desc}</p>
                <ul className="mt-4 space-y-2">
                  {copy.partnership03Features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-[#8A7F73]">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#A89B8C]" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </BorderGlow>
          </div>
        </div>
      </section>

      {/* 3. Partnership Advantages - White */}
      <section className="bg-white px-4 py-12 sm:px-6 sm:py-16 md:px-8 md:py-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-[#A89B8C]">Partnership Advantages</p>
          <h2 className="mt-4 max-w-4xl text-2xl font-bold leading-tight tracking-[0.01em] text-[#2C2825] sm:text-3xl md:text-4xl">
            {copy.advantagesTitle}
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[#8A7F73]">{copy.advantagesSubtitle}</p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {[
              { title: copy.advItem1, desc: copy.advItem1Desc, icon: "🛡️" },
              { title: copy.advItem2, desc: copy.advItem2Desc, icon: "📦" },
              { title: copy.advItem3, desc: copy.advItem3Desc, icon: "🔄" },
              { title: copy.advItem4, desc: copy.advItem4Desc, icon: "🔒" },
              { title: copy.advItem5, desc: copy.advItem5Desc, icon: "⚡" },
              { title: copy.advItem6, desc: copy.advItem6Desc, icon: "👤" }
            ].map((item) => (
              <BorderGlow key={item.title} backgroundColor="#ffffff" borderRadius={12} glowRadius={30}>
                <div className="p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#A89B8C]/10 text-lg">
                    {item.icon}
                  </div>
                  <h3 className="mt-4 text-sm font-medium text-[#2C2825]">{item.title}</h3>
                  <p className="mt-2 text-xs leading-5 text-[#8A7F73]">{item.desc}</p>
                </div>
              </BorderGlow>
            ))}
          </div>
        </div>
      </section>

      {/* 4. High-Performance Fabrics - Light Blue Gradient */}
      <section className="bg-gradient-to-b from-[#F0EBE5] to-[#FDFBF8] px-4 py-12 sm:px-6 sm:py-16 md:px-8 md:py-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-[#A89B8C]">High-Performance Fabrics</p>
          <h2 className="mt-4 max-w-4xl text-2xl font-bold leading-tight tracking-[0.01em] text-[#2C2825] sm:text-3xl md:text-4xl">
            {copy.fabricsTitle}
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[#8A7F73]">{copy.fabricsSubtitle}</p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {[
              { title: copy.fabric1, desc: copy.fabric1Desc, image: "/fabric-1.png" },
              { title: copy.fabric2, desc: copy.fabric2Desc, image: "/fabric-2.png" },
              { title: copy.fabric3, desc: copy.fabric3Desc, image: "/fabric-3.png" },
              { title: copy.fabric4, desc: copy.fabric4Desc, image: "/fabric-4.png" }
            ].map((item) => (
              <div key={item.title} className="bg-white p-5">
                <div className="relative h-40 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
                <h3 className="mt-4 text-sm font-medium text-[#2C2825]">{item.title}</h3>
                <p className="mt-2 text-xs leading-5 text-[#8A7F73]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Manufacturing Technology - White */}
      <section className="bg-white px-4 py-12 sm:px-6 sm:py-16 md:px-8 md:py-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-[#A89B8C]">Manufacturing Technology</p>
          <h2 className="mt-4 max-w-4xl text-2xl font-bold leading-tight tracking-[0.01em] text-[#2C2825] sm:text-3xl md:text-4xl">
            {copy.technologyTitle}
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[#8A7F73]">{copy.techSubtitle}</p>

          <div className="mt-10 grid gap-8 md:grid-cols-2">
            <div className="relative min-h-[200px] overflow-hidden bg-[#F5F1ED] md:min-h-[400px]">
              <Image
                src="/tech-1.png"
                alt="Manufacturing Technology"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="space-y-6">
              {[
                { title: copy.techItem1, desc: copy.techItem1Desc },
                { title: copy.techItem2, desc: copy.techItem2Desc },
                { title: copy.techItem3, desc: copy.techItem3Desc },
                { title: copy.techItem4, desc: copy.techItem4Desc }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 border-b border-[#e5e5e5] pb-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#A89B8C]/10 text-[#A89B8C]">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-[#2C2825]">{item.title}</h3>
                    <p className="mt-1 text-xs leading-5 text-[#8A7F73]">{item.desc}</p>
                  </div>
                </div>
              ))}
              <a href="#" className="inline-flex items-center gap-2 bg-[#A89B8C] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#4A3D34]">
                {copy.techCta}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Quality Assurance - Light Blue Gradient */}
      <section className="bg-gradient-to-b from-[#F0EBE5] to-[#FDFBF8] px-4 py-12 sm:px-6 sm:py-16 md:px-8 md:py-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-[#A89B8C]">Quality Assurance</p>
          <h2 className="mt-4 max-w-4xl text-2xl font-bold leading-tight tracking-[0.01em] text-[#2C2825] sm:text-3xl md:text-4xl">
            {copy.qualityTitle}
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[#8A7F73]">{copy.qualitySubtitle}</p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              { num: "01", title: copy.quality01, desc: copy.quality01Desc, tag: copy.quality01Tag },
              { num: "02", title: copy.quality02, desc: copy.quality02Desc, tag: copy.quality02Tag },
              { num: "03", title: copy.quality03, desc: copy.quality03Desc, tag: copy.quality03Tag }
            ].map((item) => (
              <BorderGlow key={item.num} backgroundColor="#ffffff" borderRadius={12} glowRadius={30}>
                <div className="p-6">
                  <p className="text-4xl font-bold text-[#A89B8C]">{item.num}</p>
                  <h3 className="mt-4 text-lg font-medium text-[#2C2825]">{item.title}</h3>
                  <p className="mt-3 text-xs leading-6 text-[#8A7F73]">{item.desc}</p>
                  <span className="mt-4 inline-block rounded-full bg-[#A89B8C]/10 px-3 py-1 text-[10px] font-medium text-[#A89B8C]">
                    {item.tag}
                  </span>
                </div>
              </BorderGlow>
            ))}
          </div>

          {/* Quality Policy */}
          <BorderGlow backgroundColor="#ffffff" borderRadius={12} glowRadius={30} className="mt-8">
            <div className="flex items-start gap-4 p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#A89B8C]/10 text-[#A89B8C]">
                🛡️
              </div>
              <div>
                <h3 className="text-sm font-medium text-[#2C2825]">{copy.qualityPolicy}</h3>
                <p className="mt-2 text-xs leading-5 text-[#8A7F73]">{copy.qualityPolicyDesc}</p>
              </div>
            </div>
          </BorderGlow>
        </div>
      </section>

      {/* 7. About Us - Dark Blue Background */}
      <section className="bg-[#3D3530] px-4 py-12 text-white sm:px-6 sm:py-16 md:px-8 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-[#C9B99A]">About Us</p>
              <h2 className="mt-4 text-2xl font-bold leading-tight tracking-[0.01em] text-white sm:text-3xl">
                {copy.aboutTitle}
              </h2>
              <p className="mt-4 text-sm leading-7 text-white/80">{copy.aboutDesc}</p>
              <div className="mt-6 flex flex-wrap gap-4">
                <a href="/pages/brand-story" className="inline-flex items-center gap-2 bg-white px-6 py-3 text-sm font-medium text-[#5C4E43] transition hover:bg-white/90">
                  {copy.aboutCta1} →
                </a>
                <a href="#" className="inline-flex items-center gap-2 border border-white px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10">
                  {copy.aboutCta2}
                </a>
              </div>
            </div>
            <div className="relative min-h-[200px] overflow-hidden bg-[#3D3530]/50 md:min-h-[300px]">
              <div className="flex h-full items-center justify-center text-white/50">Video/Image Placeholder</div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Workflow Timeline - White */}
      <section className="bg-white px-4 py-12 sm:px-6 sm:py-16 md:px-8 md:py-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-[#A89B8C]">Workflow Timeline</p>
          <h2 className="mt-4 max-w-4xl text-2xl font-bold leading-tight tracking-[0.01em] text-[#2C2825] sm:text-3xl md:text-4xl">
            {copy.workflowTitle}
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[#8A7F73]">{copy.workflowSubtitle}</p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            {[
              { step: "1", title: copy.workflowStep1, desc: copy.workflowStep1Desc },
              { step: "2", title: copy.workflowStep2, desc: copy.workflowStep2Desc },
              { step: "3", title: copy.workflowStep3, desc: copy.workflowStep3Desc },
              { step: "4", title: copy.workflowStep4, desc: copy.workflowStep4Desc },
              { step: "5", title: copy.workflowStep5, desc: copy.workflowStep5Desc },
              { step: "6", title: copy.workflowStep6, desc: copy.workflowStep6Desc }
            ].map((item) => (
              <BorderGlow key={item.step} backgroundColor="#ffffff" borderRadius={12} glowRadius={30}>
                <div className="p-4 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#A89B8C] text-sm font-bold text-white">
                    {item.step}
                  </div>
                  <div className="mt-4 h-20 bg-[#e5e5e5] text-[10px] text-[#A89B8C]">Image</div>
                  <h3 className="mt-3 text-xs font-medium text-[#2C2825]">{item.title}</h3>
                  <p className="mt-1 text-[10px] leading-4 text-[#8A7F73]">{item.desc}</p>
                </div>
              </BorderGlow>
            ))}
          </div>
        </div>
      </section>

      {/* 9. FAQ + Contact - Light Gray */}
      <section className="bg-[#FDFBF8] px-4 py-12 sm:px-6 sm:py-16 md:px-8 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-2">
            {/* FAQ */}
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-[#A89B8C]">FAQ</p>
              <h2 className="mt-4 text-2xl font-bold leading-tight tracking-[0.01em] text-[#2C2825] sm:text-3xl">
                {copy.faqTitle}
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#8A7F73]">{copy.faqSubtitle}</p>

              <div className="mt-8 divide-y divide-[#e5e5e5] border border-[#e5e5e5]">
                {faqs.map((faq, i) => (
                  <div key={i}>
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="flex w-full items-center justify-between px-5 py-4 text-left text-sm text-[#2C2825]"
                    >
                      {faq}
                      <span className="ml-4 text-[#A89B8C]">{openFaq === i ? "−" : "+"}</span>
                    </button>
                    {openFaq === i && (
                      <div className="px-5 pb-4">
                        <p className="text-xs leading-5 text-[#8A7F73]">
                          This is a placeholder answer for the frequently asked question.
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <div className="border border-[#e5e5e5] bg-white p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#A89B8C]/10 text-[#A89B8C]">
                    👤
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#2C2825]">Sales Representative</p>
                    <p className="text-xs text-[#8A7F73]">8 years experience</p>
                  </div>
                </div>
                <div className="mt-4 rounded-lg bg-[#FDFBF8] p-4">
                  <p className="text-xs leading-5 text-[#8A7F73]">
                    Hello, I&apos;m the YANXINNA sales team. Please submit your requirements through the form — I will personally respond and provide our latest product catalog, fabric specifications, and custom pricing details.
                  </p>
                </div>

                <form className="mt-6 space-y-4">
                  <div>
                    <label className="mb-1.5 block text-xs text-[#2C2825]">Full Name *</label>
                    <input type="text" required className="w-full border border-[#e5e5e5] bg-[#f9f9f9] px-4 py-3 text-sm outline-none focus:border-[#A89B8C]" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs text-[#2C2825]">Company Email *</label>
                    <input type="email" required className="w-full border border-[#e5e5e5] bg-[#f9f9f9] px-4 py-3 text-sm outline-none focus:border-[#A89B8C]" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs text-[#2C2825]">Phone/WhatsApp *</label>
                    <input type="tel" required placeholder="+1 (201) 555-0123" className="w-full border border-[#e5e5e5] bg-[#f9f9f9] px-4 py-3 text-sm outline-none focus:border-[#A89B8C]" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs text-[#2C2825]">Project Details *</label>
                    <textarea rows={4} className="w-full resize-none border border-[#e5e5e5] bg-[#f9f9f9] px-4 py-3 text-sm outline-none focus:border-[#A89B8C]" />
                  </div>
                  <div className="flex gap-4">
                    <button type="submit" className="flex-1 bg-[#A89B8C] py-3 text-sm font-medium text-white transition hover:bg-[#4A3D34]">
                      Submit
                    </button>
                    <a href="https://wa.me/13719947765" target="_blank" rel="noopener noreferrer" className="flex flex-1 items-center justify-center gap-2 bg-[#25D366] py-3 text-sm font-medium text-white transition hover:bg-[#128C7E]">
                      💬 WhatsApp
                    </a>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
