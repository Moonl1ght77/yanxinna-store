"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";
import { useLocale } from "@/hooks/use-locale";
import { SampleRequestModal } from "@/components/ui/sample-request-modal";

export default function ManufacturingCapabilitiesPage() {
  const { copy } = useLocale();
  const [showSampleModal, setShowSampleModal] = useState(false);

  const facilities = [
    { title: copy.mfgFacility1Title, desc: copy.mfgFacility1Desc, image: "/factory-1.png" },
    { title: copy.mfgFacility2Title, desc: copy.mfgFacility2Desc, image: "/factory-2.png" },
    { title: copy.mfgFacility3Title, desc: copy.mfgFacility3Desc, image: "/fabric-1.png" },
    { title: copy.mfgFacility4Title, desc: copy.mfgFacility4Desc, image: "/factory-3.png" }
  ];

  const processes = [
    { num: "01", title: copy.mfgProcess1Title, desc: copy.mfgProcess1Desc },
    { num: "02", title: copy.mfgProcess2Title, desc: copy.mfgProcess2Desc },
    { num: "03", title: copy.mfgProcess3Title, desc: copy.mfgProcess3Desc }
  ];

  const stats = [
    { value: "33", label: copy.mfgStatYears },
    { value: "100+", label: copy.mfgStatPatents },
    { value: "4-5M", label: copy.mfgStatOutput },
    { value: "30+", label: copy.mfgStatMarkets }
  ];

  return (
    <div className="w-full bg-white">
      <SampleRequestModal isOpen={showSampleModal} onClose={() => setShowSampleModal(false)} />

      {/* Hero */}
      <section className="bg-[#FDFBF8]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-28">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#A89B8C]">YANXINNA · OEM & Services</p>
          <h1 className="mt-5 max-w-4xl text-3xl/[1.2] font-bold tracking-[0.01em] text-[#2C2825] sm:text-4xl/[1.2] md:text-[48px]/[1.2]">
            {copy.mfgHeroTitle}
          </h1>
          <p className="mt-6 max-w-2xl text-sm leading-7 text-[#8A7F73] sm:text-base sm:leading-8">{copy.mfgHeroSubtitle}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={() => setShowSampleModal(true)}
              className="bg-[#A89B8C] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#4A3D34] sm:px-8 sm:py-3.5"
            >
              {copy.factoryRequestSample}
            </button>
            <a
              href="https://wa.me/13719947765"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-[#5C4E43] px-6 py-3 text-sm font-medium text-[#2C2825] transition hover:bg-[#5C4E43] hover:text-white sm:px-8 sm:py-3.5"
            >
              WhatsApp
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Advanced Production Facility */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 md:px-8 md:py-24">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#A89B8C]">01 · Production Facility</p>
        <h2 className="mt-4 max-w-2xl text-2xl/[1.2] font-bold tracking-[0.01em] text-[#2C2825] sm:text-3xl/[1.2] md:text-4xl/[1.2]">
          {copy.mfgFacilityTitle}
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[#8A7F73]">{copy.mfgFacilitySubtitle}</p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {facilities.map((item) => (
            <div key={item.title} className="group overflow-hidden border border-borderSoft bg-white transition hover:border-[#A89B8C] hover:shadow-lg">
              <div className="relative aspect-[16/9] overflow-hidden bg-[#F5F1ED]">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
              </div>
              <div className="p-6 sm:p-7">
                <h3 className="text-lg font-semibold text-[#2C2825]">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#8A7F73]">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Automated & Intelligent Process */}
      <section className="bg-[#FDFBF8]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 md:px-8 md:py-24">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#A89B8C]">02 · Intelligent Process</p>
          <h2 className="mt-4 max-w-2xl text-2xl/[1.2] font-bold tracking-[0.01em] text-[#2C2825] sm:text-3xl/[1.2] md:text-4xl/[1.2]">
            {copy.mfgProcessTitle}
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#8A7F73]">{copy.mfgProcessSubtitle}</p>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {processes.map((item) => (
              <div key={item.num} className="border border-borderSoft bg-white p-6 transition hover:border-[#A89B8C] hover:shadow-lg sm:p-7">
                <div className="flex items-center gap-3">
                  <span className="text-4xl font-bold text-[#E5DDD3]">{item.num}</span>
                  <div className="h-px flex-1 bg-borderSoft" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-[#2C2825]">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#8A7F73]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#2C2825] text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 md:px-8 md:py-20">
          <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
                <p className="text-3xl font-bold text-[#C9B99A] sm:text-4xl">{stat.value}</p>
                <p className="mt-2 text-[10px] uppercase tracking-[0.14em] text-white/60 sm:text-xs">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10-Step QC */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 md:px-8 md:py-24">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#A89B8C]">03 · Quality Control</p>
        <h2 className="mt-4 max-w-2xl text-2xl/[1.2] font-bold tracking-[0.01em] text-[#2C2825] sm:text-3xl/[1.2] md:text-4xl/[1.2]">
          {copy.mfgQcTitle}
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[#8A7F73]">{copy.mfgQcSubtitle}</p>
        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          {copy.mfgQcSteps.map((step, index) => (
            <div key={step} className="flex items-center gap-4 border border-borderSoft bg-white px-5 py-4 transition hover:border-[#A89B8C]">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F0EBE5] text-sm font-semibold text-[#A89B8C]">
                {index + 1}
              </span>
              <span className="text-sm text-[#6B5E52]">{step}</span>
              <Check className="ml-auto h-4 w-4 shrink-0 text-[#C9B99A]" strokeWidth={2} />
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#2C2825] text-white">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-20 md:px-8 md:py-24">
          <h2 className="text-2xl/[1.2] font-bold sm:text-3xl/[1.2] md:text-4xl/[1.2]">{copy.mfgCtaTitle}</h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/70">{copy.mfgCtaBody}</p>
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
