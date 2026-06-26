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
      src: "/images/shapewear-scene-21-9.png",
      href: "/shop?category=shapewear",
      label: copy.shapewearCategory,
      className: "bestseller-card-a"
    },
    {
      src: "/images/underwear-scene-bg.png",
      href: "/shop?category=underwear",
      label: copy.underwearCategory,
      className: "bestseller-card-b"
    },
    {
      src: "/images/bra-single-bg.png",
      href: "/shop?category=bras",
      label: copy.brasCategory,
      className: "bestseller-card-c"
    },
    {
      src: "/images/hero-bg.png",
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
            className="relative min-h-[100svh] overflow-hidden bg-[#edf2f8] bg-cover bg-center bg-no-repeat contrast-[1.08] saturate-[1.04]"
            style={{ backgroundImage: "url(/images/hero-bg.png)" }}
          >
            <div className="absolute inset-x-0 bottom-0 h-[36%] bg-gradient-to-t from-black/44 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 px-6 py-10 text-white md:px-8 md:py-12">
              <div className="max-w-[860px]">
                <h1 className="max-w-[340px] font-display text-[27px] leading-[1.12] tracking-[0.01em] sm:max-w-full sm:text-5xl md:max-w-5xl md:text-7xl md:leading-[0.98] md:tracking-[0.05em] xl:text-[6rem]">
                  <GradientText>{copy.heroTitle}</GradientText>
                </h1>
                <p className="mt-4 max-w-[300px] text-sm leading-7 text-white/90 md:max-w-xl md:text-lg md:leading-8">{copy.heroBody}</p>
                <div className="mt-7 flex max-w-[300px] flex-wrap gap-4 md:max-w-none md:gap-5">
                  <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.12em] md:text-sm">
                    <ShinyText text={copy.heroCta} speed={2.5} color="#ffffff" shineColor="#93C5FD" spread={120} direction="left" pauseOnHover />
                    <ArrowRight className="h-4 w-4 text-white" />
                  </span>
                  <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.12em] md:text-sm">
                    <ShinyText text={copy.heroSecondary} speed={2.5} color="#ffffff" shineColor="#93C5FD" spread={120} direction="left" pauseOnHover />
                    <ArrowRight className="h-4 w-4 text-white" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </section>

      <section id="shapewear-feature" className="relative min-h-[720px] w-full overflow-hidden">
        <Link href="/shop?category=shapewear" className="group block min-h-[720px]">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat contrast-[1.04] saturate-[1.02]"
            style={{ backgroundImage: "url(/images/shapewear-scene-21-9.png)" }}
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent px-6 py-8 md:px-8 md:py-10">
            <p className="font-display text-5xl tracking-[0.04em]"><GradientText>{copy.shapewearCategory}</GradientText></p>
            <p className="mt-3 max-w-xl text-sm leading-7 text-white/90">
              {copy.shapewearDescription}
            </p>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.12em]">
              <ShinyText text={copy.watchCta} speed={2.5} color="#ffffff" shineColor="#93C5FD" spread={120} direction="left" pauseOnHover />
              <ArrowRight className="h-4 w-4 text-white" />
            </span>
          </div>
        </Link>
      </section>

      <section className="grid w-full gap-0 md:grid-cols-2">
        <Link id="underwear-feature" href="/shop?category=underwear" className="group relative block min-h-[760px] overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat contrast-[1.04] saturate-[1.02]"
            style={{ backgroundImage: "url(/images/underwear-scene-bg.png)" }}
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent px-6 py-8 md:px-8 md:py-10">
            <p className="font-display text-4xl tracking-[0.04em]"><GradientText>{copy.underwearCategory}</GradientText></p>
            <p className="mt-3 max-w-md text-sm leading-7 text-white/90">{copy.underwearDescription}</p>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.12em]">
              <ShinyText text={copy.watchCta} speed={2.5} color="#ffffff" shineColor="#93C5FD" spread={120} direction="left" pauseOnHover />
              <ArrowRight className="h-4 w-4 text-white" />
            </span>
          </div>
        </Link>
        <Link id="bras-feature" href="/shop?category=bras" className="group relative block min-h-[760px] overflow-hidden border-l border-white/20">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat contrast-[1.04] saturate-[1.02]"
            style={{ backgroundImage: "url(/images/bra-single-bg.png)" }}
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent px-6 py-8 md:px-8 md:py-10">
            <p className="font-display text-4xl tracking-[0.04em]"><GradientText>{copy.brasCategory}</GradientText></p>
            <p className="mt-3 max-w-md text-sm leading-7 text-white/90">{copy.brasDescription}</p>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.12em]">
              <ShinyText text={copy.watchCta} speed={2.5} color="#ffffff" shineColor="#93C5FD" spread={120} direction="left" pauseOnHover />
              <ArrowRight className="h-4 w-4 text-white" />
            </span>
          </div>
        </Link>
      </section>

      <section
        id="best-sellers-feature"
        ref={bestSellersRef}
        className="relative min-h-[620px] w-full overflow-hidden bg-[#edf3f8]"
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
                sizes="(max-width: 768px) 58vw, 24vw"
                className="object-cover"
              />
            </Link>
          ))}
        </div>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent px-6 py-10 md:px-8 md:py-12">
          <p className="font-display text-5xl tracking-[0.04em]"><GradientText>{copy.bestSellerTitle}</GradientText></p>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/90">{copy.bestsellersDescription}</p>
          <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.12em]">
            <ShinyText text={copy.watchCta} speed={2.5} color="#ffffff" shineColor="#93C5FD" spread={120} direction="left" pauseOnHover />
            <ArrowRight className="h-4 w-4 text-white" />
          </span>
        </div>
      </section>

      <section className="relative min-h-[680px] w-full overflow-hidden bg-[#1e40af]">
        <SilkBackground
          speed={5}
          scale={1}
          color="#3B82F6"
          noiseIntensity={1.5}
          rotation={-10}
          className="absolute inset-0 h-full w-full"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 via-black/15 to-transparent px-6 py-10 md:px-8 md:py-12">
          <p className="font-display text-5xl tracking-[0.04em]"><GradientText>{copy.studioTitle}</GradientText></p>
          <p className="mt-4 max-w-2xl text-base leading-8 text-white/90">
            {copy.studioDescription}
          </p>
          <Link href="/shop" className="mt-6 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.12em] hover:opacity-80 transition-opacity">
            <ShinyText
              text={copy.watchCta}
              speed={2.5}
              color="#ffffff"
              shineColor="#93C5FD"
              spread={120}
              direction="left"
              pauseOnHover
            />
            <ArrowRight className="h-4 w-4 text-white" />
          </Link>
        </div>
      </section>

      <section className="w-full bg-white">
        <div className="flex items-center justify-between border-y border-borderSoft px-6 py-8 md:px-8">
          <div className="w-24" />
          <p className="font-display text-[28px] tracking-[0.04em] text-[#231f1b]">{copy.trendingTitle}</p>
          <p className="text-sm uppercase tracking-[0.12em] text-[#8a8077]">1 / 2</p>
        </div>
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex min-w-max border-b border-borderSoft">
            {trending.slice(0, 6).map((product, index) => (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                className={`group w-[260px] min-w-[260px] border-r border-borderSoft bg-white p-6 motion-rise ${
                  index % 4 === 1
                    ? "motion-delay-1"
                    : index % 4 === 2
                      ? "motion-delay-2"
                      : index % 4 === 3
                        ? "motion-delay-3"
                        : ""
                }`}
              >
                <PlaceholderImage src={product.image} alt={product.name} className="min-h-[250px] rounded-none image-zoom bg-white" />
                <div className="mt-6 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#8a8077]">{product.category}</p>
                    <p className="mt-2 text-lg font-medium uppercase leading-6 tracking-[0.04em] text-[#231f1b]">{product.name}</p>
                    <p className="mt-2 text-sm font-medium text-[#524a43]">{formatPrice(product.price, currency, locale)}</p>
                  </div>
                  <Heart className="mt-1 h-5 w-5 text-[#6f665f]" strokeWidth={1.7} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full bg-white">
        <div className="w-full border-t border-borderSoft px-6 py-16 md:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="font-display text-4xl uppercase leading-[1.28] tracking-[0.09em] text-[#231f1b] md:text-[68px]">
              {copy.brandStatement}
            </h2>
          </div>
          <div className="mt-14 overflow-hidden pt-6">
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
