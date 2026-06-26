"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Heart, RotateCcw, Smartphone, Sparkles, Truck } from "lucide-react";
import { products } from "@/lib/data/products";
import { formatPrice, sortProductsByMerchOrder } from "@/lib/utils";
import { PlaceholderImage } from "@/components/ui/placeholder-image";
import { Button } from "@/components/ui/button";
import { SilkBackground } from "@/components/ui/silk-background";
import { ShinyText } from "@/components/ui/shiny-text";
import { GradientText } from "@/components/ui/gradient-text";
import { CopyKeys } from "@/types/locale";

type HomePageProps = {
  locale: string;
  currency: string;
  copy: CopyKeys;
};

export function HomePage({ locale, currency, copy }: HomePageProps) {
  const bestSellersRef = useRef<HTMLElement | null>(null);
  const [bestSellersInView, setBestSellersInView] = useState(false);

  useEffect(() => {
    const section = bestSellersRef.current;

    if (!section || typeof IntersectionObserver === "undefined") {
      setBestSellersInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setBestSellersInView(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: "-18% 0px -22% 0px",
        threshold: 0.18
      }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, []);

  const bestSellerCards = [
    {
      src: "/images/shapewear-scene-21-9.webp",
      href: "/shop?category=shapewear",
      label: copy.shapewearCategory,
      className: "bestseller-card-a"
    },
    {
      src: "/images/underwear-scene-bg.webp",
      href: "/shop?category=underwear",
      label: copy.underwearCategory,
      className: "bestseller-card-b"
    },
    {
      src: "/images/bra-single-bg.webp",
      href: "/shop?category=bras",
      label: copy.brasCategory,
      className: "bestseller-card-c"
    },
    {
      src: "/images/hero-bg.webp",
      href: "/shop?sort=best",
      label: copy.bestsellersCategory,
      className: "bestseller-card-d"
    },
    {
      src: "/generated-products/shapewear-top-nude.png",
      href: "/shop?sort=new",
      label: copy["new arrivalsCategory"],
      className: "bestseller-card-e"
    }
  ];

  const shapewear = sortProductsByMerchOrder(
    products.filter((product) => product.category === "shapewear")
  ).slice(0, 3);
  const bras = sortProductsByMerchOrder(
    products.filter((product) => product.category === "bras")
  ).slice(0, 2);
  const underwear = sortProductsByMerchOrder(
    products.filter((product) => product.category === "underwear")
  ).slice(0, 2);
  const trending = sortProductsByMerchOrder(products);

  const serviceItems = [
    {
      icon: Truck,
      title: copy.serviceFastDelivery,
      body: copy.serviceFastDeliveryBody
    },
    {
      icon: Smartphone,
      title: copy.serviceEarlyAccess,
      body: copy.serviceEarlyAccessBody
    },
    {
      icon: BadgeCheck,
      title: copy.serviceContour,
      body: copy.serviceContourBody
    },
    {
      icon: RotateCcw,
      title: copy.serviceReturns,
      body: copy.serviceReturnsBody
    },
    {
      icon: Sparkles,
      title: copy.serviceSoftCorrection,
      body: copy.serviceSoftCorrectionBody
    }
  ];

  return (
    <div className="pb-8">
      <section className="w-full">
        <Link href="/shop?category=shapewear" className="group block overflow-hidden bg-white">
          <div
            className="relative min-h-[500px] overflow-hidden bg-[#edf2f8] bg-cover bg-[center_top_30%] bg-no-repeat contrast-[1.08] saturate-[1.04] sm:min-h-[600px] md:min-h-[100svh] md:bg-center"
            style={{ backgroundImage: "url(/images/hero-bg.webp)" }}
          >
            <div className="absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-black/50 via-black/15 to-transparent sm:h-[36%]" />
            <div className="absolute inset-x-0 bottom-0 px-5 py-10 text-white sm:px-6 sm:py-12 md:px-8 md:py-16">
              <div className="max-w-[860px]">
                <h1 className="max-w-[260px] font-display text-[22px] leading-[1.12] tracking-[0.01em] sm:max-w-[340px] sm:text-[27px] md:max-w-5xl md:text-7xl md:leading-[0.98] md:tracking-[0.05em] xl:text-[6rem]">
                  <GradientText>{copy.heroTitle}</GradientText>
                </h1>
                <p className="mt-3 max-w-[240px] text-[11px] leading-5 text-white/90 sm:mt-4 sm:max-w-[300px] sm:text-sm sm:leading-7 md:max-w-xl md:text-lg md:leading-8">{copy.heroBody}</p>
                <div className="mt-5 flex max-w-[260px] flex-wrap gap-3 sm:mt-7 sm:max-w-[300px] sm:gap-4 md:max-w-none md:gap-5">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.12em] sm:text-xs md:text-sm">
                    <ShinyText text={copy.heroCta} speed={2.5} color="#ffffff" shineColor="#93C5FD" spread={120} direction="left" pauseOnHover />
                    <ArrowRight className="h-3.5 w-3.5 text-white md:h-4 md:w-4" />
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.12em] sm:text-xs md:text-sm">
                    <ShinyText text={copy.heroSecondary} speed={2.5} color="#ffffff" shineColor="#93C5FD" spread={120} direction="left" pauseOnHover />
                    <ArrowRight className="h-3.5 w-3.5 text-white md:h-4 md:w-4" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </section>

      <section id="shapewear-feature" className="relative min-h-[450px] w-full overflow-hidden sm:min-h-[500px] md:min-h-[720px]">
        <Link href="/shop?category=shapewear" className="group block min-h-[450px] sm:min-h-[500px] md:min-h-[720px]">
          <div
            className="absolute inset-0 bg-cover bg-[center_30%] bg-no-repeat contrast-[1.04] saturate-[1.02] md:bg-center"
            style={{ backgroundImage: "url(/images/shapewear-scene-21-9.webp)" }}
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent px-5 py-8 sm:px-6 sm:py-10 md:px-8 md:py-12">
            <p className="font-display text-2xl tracking-[0.04em] sm:text-3xl md:text-5xl"><GradientText>{copy.shapewearCategory}</GradientText></p>
            <p className="mt-2 max-w-xl text-[11px] leading-5 text-white/90 sm:mt-3 sm:text-xs sm:leading-6 md:text-sm md:leading-7">
              {copy.shapewearDescription}
            </p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.12em] sm:mt-6 sm:text-xs md:text-sm">
              <ShinyText text={copy.watchCta} speed={2.5} color="#ffffff" shineColor="#93C5FD" spread={120} direction="left" pauseOnHover />
              <ArrowRight className="h-3.5 w-3.5 text-white md:h-4 md:w-4" />
            </span>
          </div>
        </Link>
      </section>

      <section className="grid w-full gap-0 md:grid-cols-2">
        <Link id="underwear-feature" href="/shop?category=underwear" className="group relative block min-h-[350px] overflow-hidden sm:min-h-[400px] md:min-h-[760px]">
          <div
            className="absolute inset-0 bg-cover bg-[center_25%] bg-no-repeat contrast-[1.04] saturate-[1.02] md:bg-center"
            style={{ backgroundImage: "url(/images/underwear-scene-bg.webp)" }}
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent px-5 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10">
            <p className="font-display text-xl tracking-[0.04em] sm:text-2xl md:text-4xl"><GradientText>{copy.underwearCategory}</GradientText></p>
            <p className="mt-2 max-w-md text-[11px] leading-5 text-white/90 sm:mt-3 sm:text-xs sm:leading-6 md:text-sm md:leading-7">{copy.underwearDescription}</p>
            <span className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.12em] sm:mt-4 sm:text-xs md:mt-6 md:text-sm">
              <ShinyText text={copy.watchCta} speed={2.5} color="#ffffff" shineColor="#93C5FD" spread={120} direction="left" pauseOnHover />
              <ArrowRight className="h-3.5 w-3.5 text-white md:h-4 md:w-4" />
            </span>
          </div>
        </Link>
        <Link id="bras-feature" href="/shop?category=bras" className="group relative block min-h-[350px] overflow-hidden border-l-0 border-white/20 sm:min-h-[400px] sm:border-l md:min-h-[760px]">
          <div
            className="absolute inset-0 bg-cover bg-[center_25%] bg-no-repeat contrast-[1.04] saturate-[1.02] md:bg-center"
            style={{ backgroundImage: "url(/images/bra-single-bg.webp)" }}
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent px-5 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10">
            <p className="font-display text-xl tracking-[0.04em] sm:text-2xl md:text-4xl"><GradientText>{copy.brasCategory}</GradientText></p>
            <p className="mt-2 max-w-md text-[11px] leading-5 text-white/90 sm:mt-3 sm:text-xs sm:leading-6 md:text-sm md:leading-7">{copy.brasDescription}</p>
            <span className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.12em] sm:mt-4 sm:text-xs md:mt-6 md:text-sm">
              <ShinyText text={copy.watchCta} speed={2.5} color="#ffffff" shineColor="#93C5FD" spread={120} direction="left" pauseOnHover />
              <ArrowRight className="h-3.5 w-3.5 text-white md:h-4 md:w-4" />
            </span>
          </div>
        </Link>
      </section>

      <section
        id="best-sellers-feature"
        ref={bestSellersRef}
        className="relative min-h-[400px] w-full overflow-hidden bg-[#edf3f8] sm:min-h-[500px] md:min-h-[620px]"
      >
        <div
          className={`bestseller-scatter absolute inset-0 bg-[#edf3f8] ${
            bestSellersInView ? "is-visible" : "is-hidden"
          }`}
          aria-label={copy.bestSellerTitle}
        >
          {bestSellerCards.map((card, index) => (
            <Link
              key={card.src}
              href={card.href}
              aria-label={card.label}
              className={`bestseller-card ${card.className}`}
              style={{ "--delay": `${index * 70}ms` } as CSSProperties}
            >
              <Image
                src={card.src}
                alt={card.label}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 58vw, 24vw"
                className="object-cover"
              />
            </Link>
          ))}
        </div>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent px-5 py-6 sm:px-6 sm:py-10 md:px-8 md:py-12">
          <p className="font-display text-3xl tracking-[0.04em] sm:text-5xl"><GradientText>{copy.bestSellerTitle}</GradientText></p>
          <p className="mt-2 max-w-2xl text-xs leading-6 text-white/90 sm:mt-3 sm:text-sm sm:leading-7">{copy.bestsellersDescription}</p>
          <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.12em] sm:mt-6 sm:text-sm">
            <ShinyText text={copy.watchCta} speed={2.5} color="#ffffff" shineColor="#93C5FD" spread={120} direction="left" pauseOnHover />
            <ArrowRight className="h-3.5 w-3.5 text-white md:h-4 md:w-4" />
          </span>
        </div>
      </section>

      <section className="relative min-h-[400px] w-full overflow-hidden bg-[#1e40af] sm:min-h-[500px] md:min-h-[680px]">
        <SilkBackground
          speed={5}
          scale={1}
          color="#3B82F6"
          noiseIntensity={1.5}
          rotation={-10}
          className="absolute inset-0 h-full w-full"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 via-black/15 to-transparent px-5 py-6 sm:px-6 sm:py-10 md:px-8 md:py-12">
          <p className="font-display text-3xl tracking-[0.04em] sm:text-5xl"><GradientText>{copy.studioTitle}</GradientText></p>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/90 sm:mt-4 sm:text-base sm:leading-8">
            {copy.studioDescription}
          </p>
          <Link href="/shop" className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.12em] sm:mt-6 sm:text-sm hover:opacity-80 transition-opacity">
            <ShinyText
              text={copy.watchCta}
              speed={2.5}
              color="#ffffff"
              shineColor="#93C5FD"
              spread={120}
              direction="left"
              pauseOnHover
            />
            <ArrowRight className="h-3.5 w-3.5 text-white md:h-4 md:w-4" />
          </Link>
        </div>
      </section>

      <section className="w-full bg-white">
        <div className="flex items-center justify-between border-y border-borderSoft px-5 py-6 sm:px-6 sm:py-8 md:px-8">
          <div className="w-16 sm:w-24" />
          <p className="font-display text-xl tracking-[0.04em] text-[#231f1b] sm:text-[28px]">{copy.trendingTitle}</p>
          <p className="text-xs uppercase tracking-[0.12em] text-[#8a8077] sm:text-sm">1 / 2</p>
        </div>
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex min-w-max border-b border-borderSoft">
            {trending.slice(0, 6).map((product, index) => (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                className={`group w-[200px] min-w-[200px] border-r border-borderSoft bg-white p-4 motion-rise sm:w-[260px] sm:min-w-[260px] sm:p-6 ${
                  index % 4 === 1
                    ? "motion-delay-1"
                    : index % 4 === 2
                      ? "motion-delay-2"
                      : index % 4 === 3
                        ? "motion-delay-3"
                        : ""
                }`}
              >
                <PlaceholderImage src={product.image} alt={product.name} className="min-h-[180px] rounded-none image-zoom bg-white sm:min-h-[250px]" />
                <div className="mt-4 flex items-start justify-between gap-3 sm:mt-6 sm:gap-4">
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#8a8077] sm:text-[11px]">{product.category}</p>
                    <p className="mt-1.5 text-sm font-medium uppercase leading-5 tracking-[0.04em] text-[#231f1b] sm:mt-2 sm:text-lg sm:leading-6">{product.name}</p>
                    <p className="mt-1.5 text-xs font-medium text-[#524a43] sm:mt-2 sm:text-sm">{formatPrice(product.price, currency, locale)}</p>
                  </div>
                  <Heart className="mt-0.5 h-4 w-4 text-[#6f665f] sm:mt-1 sm:h-5 sm:w-5" strokeWidth={1.7} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full bg-white">
        <div className="w-full border-t border-borderSoft px-5 py-10 sm:px-6 sm:py-16 md:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-base uppercase leading-[1.28] tracking-[0.06em] text-[#231f1b] sm:text-2xl sm:tracking-[0.08em] md:text-[48px] md:leading-[1.2] md:tracking-[0.04em]">
              {copy.brandStatement}
            </h2>
          </div>
          <div className="mt-8 overflow-hidden pt-4 sm:mt-14 sm:pt-6">
            <div className="marquee-track">
              {[...serviceItems, ...serviceItems].map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={`${item.title}-${index}`}
                    className="mx-5 flex min-w-[230px] flex-col items-center text-center text-[#766656] md:min-w-[260px]"
                  >
                    <Icon className="h-10 w-10" strokeWidth={1.7} />
                    <p className="mt-6 font-display text-[22px] uppercase leading-6 tracking-[0.06em]">{item.title}</p>
                    <p className="mt-2 text-[12px] font-semibold uppercase leading-5 tracking-[0.16em]">{item.body}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
