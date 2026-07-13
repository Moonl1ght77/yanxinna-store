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
      {/* 1. Capabilities & Services - Asymmetric Layout */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-28">
        <div className="grid gap-12 lg:grid-cols-[1fr,2fr] lg:items-start">
          {/* Left - Title Block */}
          <div className="lg:sticky lg:top-24">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#A89B8C]">Capabilities & Services</p>
            <h2 className="mt-4 max-w-sm text-2xl font-bold leading-[1.15] tracking-[0.01em] text-[#2C2825] sm:text-3xl md:text-4xl">
              {copy.capabilitiesTitle}
            </h2>
            <p className="mt-5 max-w-sm text-sm leading-7 text-[#8A7F73]">{copy.capabilitiesSubtitle}</p>
            {/* Decorative Line */}
            <div className="mt-8 h-px w-16 bg-gradient-to-r from-[#A89B8C] to-transparent" />
          </div>

          {/* Right - Content Cards */}
          <div className="space-y-8">
            {/* 01 Quality */}
            <div className="group grid gap-6 sm:grid-cols-[1fr,1.5fr] sm:items-center">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#F5F1ED]">
                <Image
                  src="/factory-1.png"
                  alt="Quality Control"
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
                <div className="absolute left-4 top-4 rounded-full bg-[#A89B8C] px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-white">
                  01
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#2C2825]">{copy.cap01Title}</h3>
                <div className="mt-5 grid gap-3">
                  {[
                    { title: copy.cap01Item1, desc: copy.cap01Item1Desc },
                    { title: copy.cap01Item2, desc: copy.cap01Item2Desc },
                    { title: copy.cap01Item3, desc: copy.cap01Item3Desc }
                  ].map((item, i) => (
                    <div key={i} className="group/card rounded-xl border border-[#e5e5e5] bg-white p-4 transition hover:border-[#A89B8C] hover:shadow-sm">
                      <p className="text-sm font-medium text-[#2C2825]">{item.title}</p>
                      <p className="mt-1.5 text-xs leading-5 text-[#8A7F73]">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 02 Style Development - Reversed */}
            <div className="group grid gap-6 sm:grid-cols-[1.5fr,1fr] sm:items-center">
              <div className="order-2 sm:order-1">
                <h3 className="text-lg font-semibold text-[#2C2825]">{copy.cap02Title}</h3>
                <div className="mt-5 grid gap-3">
                  {[
                    { title: copy.cap02Item1, desc: copy.cap02Item1Desc },
                    { title: copy.cap02Item2, desc: copy.cap02Item2Desc },
                    { title: copy.cap02Item3, desc: copy.cap02Item3Desc }
                  ].map((item, i) => (
                    <div key={i} className="group/card rounded-xl border border-[#e5e5e5] bg-white p-4 transition hover:border-[#A89B8C] hover:shadow-sm">
                      <p className="text-sm font-medium text-[#2C2825]">{item.title}</p>
                      <p className="mt-1.5 text-xs leading-5 text-[#8A7F73]">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#F5F1ED] sm:order-2">
                <Image
                  src="/factory-2.png"
                  alt="Style Development"
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
                <div className="absolute left-4 top-4 rounded-full bg-[#A89B8C] px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-white">
                  02
                </div>
              </div>
            </div>

            {/* 03 Fast Launch */}
            <div className="group grid gap-6 sm:grid-cols-[1fr,1.5fr] sm:items-center">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#F5F1ED]">
                <Image
                  src="/factory-3.png"
                  alt="Fast Launch"
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
                <div className="absolute left-4 top-4 rounded-full bg-[#A89B8C] px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-white">
                  03
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#2C2825]">{copy.cap03Title}</h3>
                <div className="mt-5 grid gap-3">
                  {[
                    { title: copy.cap03Item1, desc: copy.cap03Item1Desc },
                    { title: copy.cap03Item2, desc: copy.cap03Item2Desc },
                    { title: copy.cap03Item3, desc: copy.cap03Item3Desc }
                  ].map((item, i) => (
                    <div key={i} className="group/card rounded-xl border border-[#e5e5e5] bg-white p-4 transition hover:border-[#A89B8C] hover:shadow-sm">
                      <p className="text-sm font-medium text-[#2C2825]">{item.title}</p>
                      <p className="mt-1.5 text-xs leading-5 text-[#8A7F73]">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Partnership Models - Stacked Cards with Visual Hierarchy */}
      <section className="overflow-x-clip bg-gradient-to-b from-[#F0EBE5] to-[#FDFBF8] px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-7xl">
          {/* Section Header - Centered */}
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#A89B8C]">Partnership Models</p>
            <h2 className="mt-4 text-2xl font-bold leading-[1.15] tracking-[0.01em] text-[#2C2825] sm:text-3xl md:text-4xl">
              {copy.partnershipTitle}
            </h2>
            <p className="mt-5 text-sm leading-7 text-[#8A7F73]">{copy.partnershipSubtitle}</p>
          </div>

          {/* Cards - Horizontal Scroll on Mobile, Grid on Desktop */}
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              { num: "01", title: copy.partnership01Title, subtitle: copy.partnership01Subtitle, desc: copy.partnership01Desc, features: copy.partnership01Features },
              { num: "02", title: copy.partnership02Title, subtitle: copy.partnership02Subtitle, desc: copy.partnership02Desc, features: copy.partnership02Features },
              { num: "03", title: copy.partnership03Title, subtitle: copy.partnership03Subtitle, desc: copy.partnership03Desc, features: copy.partnership03Features }
            ].map((item, index) => (
              <div
                key={item.num}
                className="group relative"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <BorderGlow
                  backgroundColor="#2C2825"
                  borderRadius={20}
                  glowRadius={40}
                  glowIntensity={1.2}
                  colors={["#C9B99A", "#A89B8C", "#8B7B6B"]}
                >
                  <div className="relative overflow-hidden p-7 text-white">
                    {/* Subtle Glow on Hover */}
                    <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-[#C9B99A]/10 opacity-0 blur-3xl transition-all duration-700 group-hover:opacity-100 group-hover:scale-150" />

                    {/* Number with animated line */}
                    <div className="relative flex items-center gap-3">
                      <span className="text-5xl font-bold text-[#C9B99A] transition-transform duration-500 group-hover:scale-110">
                        {item.num}
                      </span>
                      <div className="h-px flex-1 bg-white/20 transition-all duration-500 group-hover:bg-[#C9B99A]/50" />
                    </div>

                    <h3 className="mt-5 text-xl font-semibold text-white transition-colors duration-300 group-hover:text-[#C9B99A]">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-xs font-medium text-[#C9B99A]">
                      {item.subtitle}
                    </p>

                    <p className="mt-4 text-sm leading-6 text-white/80">
                      {item.desc}
                    </p>

                    <ul className="mt-5 space-y-2.5">
                      {item.features.map((feature, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2.5 text-sm text-white/90 transition-all duration-500 hover:translate-x-1"
                          style={{ transitionDelay: `${i * 50}ms` }}
                        >
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#C9B99A] transition-transform duration-300 group-hover:scale-150" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    {/* Bottom Accent Line */}
                    <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-[#C9B99A] to-[#A89B8C] transition-all duration-500 group-hover:w-full" />
                  </div>
                </BorderGlow>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Partnership Advantages - Icon Grid */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[1fr,2fr]">
            {/* Left - Title */}
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#A89B8C]">Partnership Advantages</p>
              <h2 className="mt-4 text-2xl font-bold leading-[1.15] tracking-[0.01em] text-[#2C2825] sm:text-3xl md:text-4xl">
                {copy.advantagesTitle}
              </h2>
              <p className="mt-5 max-w-sm text-sm leading-7 text-[#8A7F73]">{copy.advantagesSubtitle}</p>
              <div className="mt-8 h-px w-16 bg-gradient-to-r from-[#A89B8C] to-transparent" />
            </div>

            {/* Right - Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { title: copy.advItem1, desc: copy.advItem1Desc, icon: "🛡️" },
                { title: copy.advItem2, desc: copy.advItem2Desc, icon: "📦" },
                { title: copy.advItem3, desc: copy.advItem3Desc, icon: "🔄" },
                { title: copy.advItem4, desc: copy.advItem4Desc, icon: "🔒" },
                { title: copy.advItem5, desc: copy.advItem5Desc, icon: "⚡" },
                { title: copy.advItem6, desc: copy.advItem6Desc, icon: "👤" }
              ].map((item) => (
                <div key={item.title} className="group rounded-2xl border border-[#e5e5e5] bg-white p-5 transition-all duration-500 hover:-translate-y-3 hover:border-[#A89B8C] hover:bg-[#2C2825] hover:shadow-2xl">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F0EBE5] text-xl transition-all duration-500 group-hover:bg-[#C9B99A]/20">
                    {item.icon}
                  </div>
                  <h3 className="mt-4 text-sm font-semibold text-[#2C2825] transition-colors duration-500 group-hover:text-white">{item.title}</h3>
                  <p className="mt-2 text-xs leading-5 text-[#8A7F73] transition-colors duration-500 group-hover:text-white/70">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. High-Performance Fabrics - Horizontal Cards */}
      <section className="bg-gradient-to-b from-[#F0EBE5] to-[#FDFBF8] px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#A89B8C]">High-Performance Fabrics</p>
            <h2 className="mt-4 text-2xl font-bold leading-[1.15] tracking-[0.01em] text-[#2C2825] sm:text-3xl md:text-4xl">
              {copy.fabricsTitle}
            </h2>
            <p className="mt-5 text-sm leading-7 text-[#8A7F73]">{copy.fabricsSubtitle}</p>
          </div>

          {/* Fabric Cards - Staggered Layout */}
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: copy.fabric1, desc: copy.fabric1Desc, image: "/fabric-1.png" },
              { title: copy.fabric2, desc: copy.fabric2Desc, image: "/fabric-2.png" },
              { title: copy.fabric3, desc: copy.fabric3Desc, image: "/fabric-3.png" },
              { title: copy.fabric4, desc: copy.fabric4Desc, image: "/fabric-4.png" }
            ].map((item, i) => (
              <div
                key={item.title}
                className={`group overflow-hidden rounded-2xl bg-white transition hover:shadow-lg ${i % 2 === 0 ? "lg:mt-0" : "lg:mt-8"}`}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-sm font-semibold text-[#2C2825]">{item.title}</h3>
                  <p className="mt-2 text-xs leading-5 text-[#8A7F73]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Manufacturing Technology - Split View */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            {/* Left - Image */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-[#F5F1ED] lg:aspect-[3/4]">
              <Image
                src="/tech-1.png"
                alt="Manufacturing Technology"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            {/* Right - Content */}
            <div className="lg:pl-8">
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#A89B8C]">Manufacturing Technology</p>
              <h2 className="mt-4 text-2xl font-bold leading-[1.15] tracking-[0.01em] text-[#2C2825] sm:text-3xl md:text-4xl">
                {copy.technologyTitle}
              </h2>
              <p className="mt-5 text-sm leading-7 text-[#8A7F73]">{copy.techSubtitle}</p>

              <div className="mt-8 space-y-5">
                {[
                  { title: copy.techItem1, desc: copy.techItem1Desc },
                  { title: copy.techItem2, desc: copy.techItem2Desc },
                  { title: copy.techItem3, desc: copy.techItem3Desc },
                  { title: copy.techItem4, desc: copy.techItem4Desc }
                ].map((item, i) => (
                  <div key={i} className="group flex gap-4 rounded-xl border border-transparent p-3 transition hover:border-[#e5e5e5] hover:bg-white">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F0EBE5] text-sm font-semibold text-[#A89B8C] transition group-hover:bg-[#A89B8C] group-hover:text-white">
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-[#2C2825]">{item.title}</h3>
                      <p className="mt-1 text-xs leading-5 text-[#8A7F73]">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <a href="#" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#A89B8C] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#4A3D34]">
                {copy.techCta}
                <span className="text-lg">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Quality Assurance - Timeline Style */}
      <section className="bg-gradient-to-b from-[#F0EBE5] to-[#FDFBF8] px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#A89B8C]">Quality Assurance</p>
            <h2 className="mt-4 text-2xl font-bold leading-[1.15] tracking-[0.01em] text-[#2C2825] sm:text-3xl md:text-4xl">
              {copy.qualityTitle}
            </h2>
            <p className="mt-5 text-sm leading-7 text-[#8A7F73]">{copy.qualitySubtitle}</p>
          </div>

          {/* Quality Cards */}
          <div className="relative mt-12">
            {/* Connector Line (Desktop) */}
            <div className="absolute left-0 top-12 hidden h-px w-full bg-gradient-to-r from-transparent via-[#A89B8C]/30 to-transparent lg:block" />

            <div className="grid gap-6 md:grid-cols-3">
              {[
                { num: "01", title: copy.quality01, desc: copy.quality01Desc, tag: copy.quality01Tag },
                { num: "02", title: copy.quality02, desc: copy.quality02Desc, tag: copy.quality02Tag },
                { num: "03", title: copy.quality03, desc: copy.quality03Desc, tag: copy.quality03Tag }
              ].map((item) => (
                <div key={item.num} className="group relative">
                  {/* Circle Marker */}
                  <div className="absolute -top-3 left-6 z-20 flex h-6 w-6 items-center justify-center rounded-full bg-[#A89B8C] text-[10px] font-bold text-white transition-all duration-700 ease-out group-hover:scale-125 group-hover:bg-[#C9B99A] md:left-1/2 md:-translate-x-1/2">
                    {item.num}
                  </div>

                  <div className="mt-6 overflow-hidden rounded-2xl border border-[#e5e5e5] bg-white shadow-sm transition-all duration-700 ease-out group-hover:-translate-y-2 group-hover:border-[#A89B8C] group-hover:bg-[#2C2825] group-hover:shadow-xl md:mt-8">
                    <div className="p-6">
                      <h3 className="text-base font-semibold text-[#2C2825] transition-colors duration-700 ease-out group-hover:text-white">{item.title}</h3>
                      <p className="mt-3 text-sm leading-6 text-[#8A7F73] transition-colors duration-700 ease-out group-hover:text-white/70">{item.desc}</p>
                      <span className="mt-4 inline-block rounded-full bg-[#F0EBE5] px-3 py-1.5 text-[10px] font-medium text-[#A89B8C] transition-all duration-700 ease-out group-hover:bg-[#C9B99A]/20 group-hover:text-[#C9B99A]">
                        {item.tag}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quality Policy */}
          <div className="mt-10 rounded-2xl border border-[#e5e5e5] bg-white p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F0EBE5] text-xl">
                🛡️
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#2C2825]">{copy.qualityPolicy}</h3>
                <p className="mt-2 text-xs leading-5 text-[#8A7F73]">{copy.qualityPolicyDesc}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. About Us - Full Width with Overlapping Elements */}
      <section className="relative overflow-hidden bg-[#2C2825] px-4 py-20 text-white sm:px-6 sm:py-24 md:px-8 md:py-32">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: "radial-gradient(circle at 25% 25%, #A89B8C 1px, transparent 1px)",
            backgroundSize: "50px 50px"
          }} />
        </div>

        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            {/* Left - Content */}
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#C9B99A]">About Us</p>
              <h2 className="mt-4 text-2xl font-bold leading-[1.15] tracking-[0.01em] text-white sm:text-3xl md:text-4xl">
                {copy.aboutTitle}
              </h2>
              <p className="mt-5 max-w-lg text-sm leading-7 text-white/70">{copy.aboutDesc}</p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a href="/pages/brand-story" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-[#2C2825] transition hover:bg-white/90">
                  {copy.aboutCta1}
                  <span>→</span>
                </a>
                <a href="#" className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10">
                  {copy.aboutCta2}
                </a>
              </div>
            </div>

            {/* Right - Stats */}
            <div className="grid grid-cols-2 gap-5">
              {[
                { value: "33", label: "Years Experience" },
                { value: "100+", label: "Design Patents" },
                { value: "4-5M", label: "Pieces/Year" },
                { value: "30+", label: "Countries" }
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur-sm">
                  <p className="text-3xl font-bold text-[#C9B99A] sm:text-4xl">{stat.value}</p>
                  <p className="mt-2 text-[10px] uppercase tracking-wider text-white/60">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8. Workflow Timeline - Horizontal Steps */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#A89B8C]">Workflow Timeline</p>
            <h2 className="mt-4 text-2xl font-bold leading-[1.15] tracking-[0.01em] text-[#2C2825] sm:text-3xl md:text-4xl">
              {copy.workflowTitle}
            </h2>
            <p className="mt-5 text-sm leading-7 text-[#8A7F73]">{copy.workflowSubtitle}</p>
          </div>

          {/* Steps */}
          <div className="relative mt-12">
            {/* Connector Line */}
            <div className="absolute left-0 top-6 hidden h-px w-full bg-gradient-to-r from-[#A89B8C]/20 via-[#A89B8C]/40 to-[#A89B8C]/20 md:block" />

            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
              {[
                { step: "1", title: copy.workflowStep1, desc: copy.workflowStep1Desc },
                { step: "2", title: copy.workflowStep2, desc: copy.workflowStep2Desc },
                { step: "3", title: copy.workflowStep3, desc: copy.workflowStep3Desc },
                { step: "4", title: copy.workflowStep4, desc: copy.workflowStep4Desc },
                { step: "5", title: copy.workflowStep5, desc: copy.workflowStep5Desc },
                { step: "6", title: copy.workflowStep6, desc: copy.workflowStep6Desc }
              ].map((item, i) => (
                <div key={item.step} className="group relative text-center">
                  {/* Step Circle */}
                  <div className="relative z-20 mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#A89B8C] text-sm font-bold text-white shadow-lg transition-all duration-500 group-hover:scale-125 group-hover:bg-[#C9B99A]">
                    {item.step}
                  </div>

                  {/* Arrow (Desktop) */}
                  {i < 5 && (
                    <div className="absolute left-1/2 top-6 hidden h-px w-full -translate-x-1/2 bg-[#A89B8C]/20 lg:block" />
                  )}

                  <div className="relative mt-4 overflow-hidden rounded-xl border border-[#e5e5e5] bg-white p-4 transition-all duration-500 group-hover:-translate-y-3 group-hover:border-[#A89B8C] group-hover:shadow-2xl">
                    {/* Hover Background */}
                    <div className="absolute inset-0 rounded-[inherit] bg-[#2C2825] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                    <div className="relative z-10">
                      <div className="mx-auto mb-3 h-16 w-full rounded-lg bg-[#F0EBE5] transition-all duration-500 group-hover:bg-[#C9B99A]/20" />
                      <h3 className="text-xs font-semibold text-[#2C2825] transition-colors duration-500 group-hover:text-white">{item.title}</h3>
                      <p className="mt-1 text-[10px] leading-4 text-[#8A7F73] transition-colors duration-500 group-hover:text-white/70">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 9. FAQ + Contact - Two Column */}
      <section className="bg-[#FDFBF8] px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* FAQ */}
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#A89B8C]">FAQ</p>
              <h2 className="mt-4 text-2xl font-bold leading-[1.15] tracking-[0.01em] text-[#2C2825] sm:text-3xl">
                {copy.faqTitle}
              </h2>
              <p className="mt-5 text-sm leading-7 text-[#8A7F73]">{copy.faqSubtitle}</p>

              <div className="mt-8 space-y-3">
                {faqs.map((faq, i) => (
                  <div key={i} className="overflow-hidden rounded-xl border border-[#e5e5e5] bg-white transition hover:border-[#A89B8C]">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium text-[#2C2825]"
                    >
                      <span className="pr-4">{faq}</span>
                      <span className="shrink-0 text-[#A89B8C]">{openFaq === i ? "−" : "+"}</span>
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
              <div className="overflow-hidden rounded-2xl border border-[#e5e5e5] bg-white">
                {/* Header */}
                <div className="bg-[#2C2825] p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white">
                      👤
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Sales Representative</p>
                      <p className="text-xs text-white/60">33 years experience</p>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div className="border-b border-[#e5e5e5] p-6">
                  <div className="rounded-xl bg-[#FDFBF8] p-4">
                    <p className="text-xs leading-5 text-[#8A7F73]">
                      Hello, I&apos;m the YANXINNA sales team. Please submit your requirements through the form — I will personally respond and provide our latest product catalog, fabric specifications, and custom pricing details.
                    </p>
                  </div>
                </div>

                {/* Form */}
                <form className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-[#2C2825]">Full Name *</label>
                      <input type="text" required className="w-full rounded-lg border border-[#e5e5e5] bg-[#FDFBF8] px-4 py-3 text-sm outline-none transition focus:border-[#A89B8C] focus:ring-1 focus:ring-[#A89B8C]" />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-[#2C2825]">Company Email *</label>
                      <input type="email" required className="w-full rounded-lg border border-[#e5e5e5] bg-[#FDFBF8] px-4 py-3 text-sm outline-none transition focus:border-[#A89B8C] focus:ring-1 focus:ring-[#A89B8C]" />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-[#2C2825]">Phone/WhatsApp *</label>
                      <input type="tel" required placeholder="+1 (201) 555-0123" className="w-full rounded-lg border border-[#e5e5e5] bg-[#FDFBF8] px-4 py-3 text-sm outline-none transition focus:border-[#A89B8C] focus:ring-1 focus:ring-[#A89B8C]" />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-[#2C2825]">Project Details *</label>
                      <textarea rows={4} className="w-full resize-none rounded-lg border border-[#e5e5e5] bg-[#FDFBF8] px-4 py-3 text-sm outline-none transition focus:border-[#A89B8C] focus:ring-1 focus:ring-[#A89B8C]" />
                    </div>
                  </div>

                  <div className="mt-6 flex gap-4">
                    <button type="submit" className="flex-1 rounded-full bg-[#A89B8C] py-3.5 text-sm font-medium text-white transition hover:bg-[#4A3D34]">
                      Submit
                    </button>
                    <a href="https://wa.me/13719947765" target="_blank" rel="noopener noreferrer" className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#25D366] py-3.5 text-sm font-medium text-white transition hover:bg-[#128C7E]">
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
