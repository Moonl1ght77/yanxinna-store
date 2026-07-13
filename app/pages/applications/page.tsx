"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { products } from "@/lib/data/products";
import { formatPrice } from "@/lib/utils";
import { useLocale } from "@/hooks/use-locale";
import { ProductCardImage } from "@/components/ui/product-card-image";
import { SampleRequestModal } from "@/components/ui/sample-request-modal";

export default function ApplicationsPage() {
  const { locale, currency, copy } = useLocale();
  const [showSampleModal, setShowSampleModal] = useState(false);

  const technologies = [
    { num: "01", name: copy.appTech1Name, tag: copy.appTech1Tag, desc: copy.appTech1Desc, adv: copy.appTech1Adv },
    { num: "02", name: copy.appTech2Name, tag: copy.appTech2Tag, desc: copy.appTech2Desc, adv: copy.appTech2Adv },
    { num: "03", name: copy.appTech3Name, tag: copy.appTech3Tag, desc: copy.appTech3Desc, adv: copy.appTech3Adv }
  ];

  const stats = [
    { value: "33", label: copy.appStatYears },
    { value: "100+", label: copy.appStatPatents },
    { value: "4-5M", label: copy.appStatOutput },
    { value: "30+", label: copy.appStatMarkets }
  ];

  const qualityTests = [
    { name: copy.appQuality1Name, tag: copy.appQuality1Tag, desc: copy.appQuality1Desc },
    { name: copy.appQuality2Name, tag: copy.appQuality2Tag, desc: copy.appQuality2Desc },
    { name: copy.appQuality3Name, tag: copy.appQuality3Tag, desc: copy.appQuality3Desc },
    { name: copy.appQuality4Name, tag: copy.appQuality4Tag, desc: copy.appQuality4Desc }
  ];

  const partnerships = [
    { num: "01", title: copy.partnership01Title, subtitle: copy.partnership01Subtitle, desc: copy.partnership01Desc, features: copy.partnership01Features },
    { num: "02", title: copy.partnership02Title, subtitle: copy.partnership02Subtitle, desc: copy.partnership02Desc, features: copy.partnership02Features },
    { num: "03", title: copy.partnership03Title, subtitle: copy.partnership03Subtitle, desc: copy.partnership03Desc, features: copy.partnership03Features }
  ];

  return (
    <div className="w-full bg-white">
      <SampleRequestModal isOpen={showSampleModal} onClose={() => setShowSampleModal(false)} />

      {/* Hero */}
      <section className="bg-[#FDFBF8]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-28">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#A89B8C]">YANXINNA Product Landing</p>
          <h1 className="mt-5 max-w-4xl font-display text-3xl/[1.15] tracking-[0.02em] text-[#2C2825] sm:text-4xl/[1.15] md:text-[52px]/[1.15]">
            {copy.appHeroTitle}
          </h1>
          <p className="mt-6 max-w-2xl text-sm leading-7 text-[#8A7F73] sm:text-base sm:leading-8">{copy.appHeroSubtitle}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={() => setShowSampleModal(true)}
              className="bg-[#A89B8C] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#4A3D34] sm:px-8 sm:py-3.5"
            >
              {copy.factoryRequestSample}
            </button>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 border border-[#5C4E43] px-6 py-3 text-sm font-medium text-[#2C2825] transition hover:bg-[#5C4E43] hover:text-white sm:px-8 sm:py-3.5"
            >
              {copy.appHeroCta}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 01 Competency */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 md:px-8 md:py-24">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#A89B8C]">01 · Competency</p>
        <h2 className="mt-4 max-w-2xl text-2xl/[1.2] font-bold tracking-[0.01em] text-[#2C2825] sm:text-3xl/[1.2] md:text-4xl/[1.2]">
          {copy.appCompetencyTitle}
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[#8A7F73]">{copy.appCompetencySubtitle}</p>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {technologies.map((tech) => (
            <div key={tech.num} className="group border border-borderSoft bg-white p-6 transition hover:border-[#A89B8C] hover:shadow-lg sm:p-7">
              <div className="flex items-center gap-3">
                <span className="text-4xl font-bold text-[#E5DDD3] transition group-hover:text-[#C9B99A]">{tech.num}</span>
                <div className="h-px flex-1 bg-borderSoft" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-[#2C2825]">{tech.name}</h3>
              <span className="mt-2 inline-block rounded-full bg-[#F0EBE5] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-[#A89B8C]">
                {tech.tag}
              </span>
              <p className="mt-4 text-sm leading-6 text-[#8A7F73]">{tech.desc}</p>
              <p className="mt-4 border-t border-borderSoft pt-4 text-xs leading-5 text-[#6B5E52]">{tech.adv}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 02 Product Matrix */}
      <section className="bg-[#FDFBF8]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 md:px-8 md:py-24">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#A89B8C]">02 · Product Matrix</p>
          <h2 className="mt-4 text-2xl/[1.2] font-bold tracking-[0.01em] text-[#2C2825] sm:text-3xl/[1.2] md:text-4xl/[1.2]">
            {copy.appMatrixTitle}
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#8A7F73]">{copy.appMatrixSubtitle}</p>

          {/* Tier 1 - Core products */}
          <div className="mt-10">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h3 className="text-lg font-semibold text-[#2C2825]">{copy.appTier1Title}</h3>
              <span className="text-xs tracking-[0.1em] text-[#C9B99A]">★★★★★</span>
            </div>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#8A7F73]">{copy.appTier1Desc}</p>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
              {products.map((product) => (
                <Link key={product.id} href={`/product/${product.slug}`} className="group border border-borderSoft bg-white p-3 transition hover:-translate-y-1 hover:shadow-lg sm:p-4">
                  <ProductCardImage src={product.image} hoverSrc={product.hoverImage} alt={product.name} className="aspect-[3/4]" />
                  <p className="mt-3 text-xs font-medium text-[#2C2825] sm:text-sm">{product.name}</p>
                  <p className="mt-1 text-xs text-[#6B5E52]">{formatPrice(product.price, currency, locale)}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Tier 2 - Expansion categories */}
          <div className="mt-12 border-t border-borderSoft pt-10">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h3 className="text-lg font-semibold text-[#2C2825]">{copy.appTier2Title}</h3>
              <span className="text-xs tracking-[0.1em] text-[#C9B99A]">★★★★☆</span>
            </div>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#8A7F73]">{copy.appTier2Desc}</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {copy.appTier2Items.map((item) => (
                <div key={item} className="flex items-center gap-3 border border-borderSoft bg-white px-4 py-3">
                  <Check className="h-4 w-4 shrink-0 text-[#A89B8C]" strokeWidth={2} />
                  <span className="text-sm text-[#6B5E52]">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 03 Production Capacity */}
      <section className="bg-[#2C2825] text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 md:px-8 md:py-24">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#C9B99A]">03 · Production Capacity</p>
          <h2 className="mt-4 text-2xl/[1.2] font-bold tracking-[0.01em] sm:text-3xl/[1.2] md:text-4xl/[1.2]">
            {copy.appCapacityTitle}
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70">{copy.appCapacitySubtitle}</p>
          <div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
                <p className="text-3xl font-bold text-[#C9B99A] sm:text-4xl">{stat.value}</p>
                <p className="mt-2 text-[10px] uppercase tracking-[0.14em] text-white/60 sm:text-xs">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 04 Quality Standards */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 md:px-8 md:py-24">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#A89B8C]">04 · Quality Standards</p>
        <h2 className="mt-4 text-2xl/[1.2] font-bold tracking-[0.01em] text-[#2C2825] sm:text-3xl/[1.2] md:text-4xl/[1.2]">
          {copy.appQualityTitle}
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[#8A7F73]">{copy.appQualitySubtitle}</p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {qualityTests.map((test) => (
            <div key={test.name} className="border border-borderSoft bg-white p-6 transition hover:border-[#A89B8C] sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-base font-semibold text-[#2C2825]">{test.name}</h3>
                <span className="rounded-full bg-[#F0EBE5] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-[#A89B8C]">
                  {test.tag}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-[#8A7F73]">{test.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 05 Partnership Models */}
      <section className="bg-[#FDFBF8]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 md:px-8 md:py-24">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#A89B8C]">05 · B2B Partnership</p>
          <h2 className="mt-4 max-w-2xl text-2xl/[1.2] font-bold tracking-[0.01em] text-[#2C2825] sm:text-3xl/[1.2] md:text-4xl/[1.2]">
            {copy.partnershipTitle}
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#8A7F73]">{copy.partnershipSubtitle}</p>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {partnerships.map((item) => (
              <div key={item.num} className="border border-borderSoft bg-white p-6 transition hover:border-[#A89B8C] hover:shadow-lg sm:p-7">
                <div className="flex items-center gap-3">
                  <span className="text-4xl font-bold text-[#E5DDD3]">{item.num}</span>
                  <div className="h-px flex-1 bg-borderSoft" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-[#2C2825]">{item.title}</h3>
                <p className="mt-1 text-xs font-medium text-[#A89B8C]">{item.subtitle}</p>
                <p className="mt-4 text-sm leading-6 text-[#8A7F73]">{item.desc}</p>
                <ul className="mt-5 space-y-2.5 border-t border-borderSoft pt-5">
                  {item.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm text-[#6B5E52]">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#C9B99A]" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#2C2825] text-white">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-20 md:px-8 md:py-24">
          <h2 className="text-2xl/[1.2] font-bold sm:text-3xl/[1.2] md:text-4xl/[1.2]">{copy.appCtaTitle}</h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/70">{copy.appCtaBody}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setShowSampleModal(true)}
              className="bg-[#C9B99A] px-8 py-3.5 text-sm font-medium text-[#2C2825] transition hover:bg-white"
            >
              {copy.factoryRequestSample}
            </button>
            <a
              href="https://wa.me/13719947765"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-white/30 px-8 py-3.5 text-sm font-medium text-white transition hover:bg-white/10"
            >
              WhatsApp
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
