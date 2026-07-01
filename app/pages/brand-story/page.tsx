"use client";

import Image from "next/image";
import { useLocale } from "@/hooks/use-locale";

export default function BrandStoryPage() {
  const { copy } = useLocale();

  return (
    <div className="w-full bg-white">
      {/* Hero - SKIMS Style */}
      <section className="mx-auto grid min-h-[500px] w-full max-w-[1400px] md:grid-cols-[1fr,1fr] md:min-h-[600px]">
        {/* Left - Text */}
        <div className="flex flex-col justify-center px-8 py-12 sm:px-12 md:px-16 md:py-20">
          <h1 className="max-w-[500px] text-2xl font-bold leading-[1.25] tracking-[0.01em] text-[#2C2825] sm:text-3xl md:text-[40px] lg:text-[48px]">
            <span className="font-bold">YANXINNA</span> {copy.brandStoryPhilosophyTitle}
          </h1>
          <p className="mt-6 max-w-[450px] text-xs leading-6 text-[#8A7F73] sm:text-sm sm:leading-7">
            {copy.brandStoryPhilosophyDesc}
          </p>
        </div>

        {/* Right - Image */}
        <div className="relative min-h-[350px] md:min-h-full">
          <Image
            src="/images/shapewear-scene-21-9.webp"
            alt="YANXINNA Brand"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </section>

      {/* Our Story - Full Width Banner */}
      <section className="relative min-h-[400px] w-full overflow-hidden bg-[#3D3530] sm:min-h-[500px] md:min-h-[600px]">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/hero-bg.webp')",
            filter: "brightness(0.7) saturate(1.3)"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#A89B8C]/40 to-[#1e40af]/90" />
        <div className="relative flex min-h-[400px] flex-col items-center justify-center px-6 text-center text-white sm:min-h-[500px] md:min-h-[600px]">
          <h2 className="text-4xl font-bold tracking-[0.02em] sm:text-5xl md:text-6xl lg:text-7xl">
            {copy.brandStoryTitle}
          </h2>
          <p className="mt-4 max-w-2xl text-xs leading-6 text-white/90 sm:mt-6 sm:text-sm sm:leading-7 md:text-base">
            {copy.brandStorySubtitle}
          </p>
        </div>
      </section>
    </div>
  );
}
