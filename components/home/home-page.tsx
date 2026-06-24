import Link from "next/link";
import { ArrowRight, BadgeCheck, Heart, RotateCcw, Smartphone, Sparkles, Truck } from "lucide-react";
import { categoryEntries, products } from "@/lib/data/products";
import { formatPrice, sortProductsByMerchOrder } from "@/lib/utils";
import { PlaceholderImage } from "@/components/ui/placeholder-image";
import { Button } from "@/components/ui/button";

type HomePageProps = {
  locale: string;
  currency: string;
  copy: {
    heroTitle: string;
    heroBody: string;
    heroCta: string;
    heroSecondary: string;
    shapewearIntro: string;
    categoryLabel: string;
    bestSellerTitle: string;
    philosophyTitle: string;
    philosophyBody: string;
    fabricTitle: string;
    fabricItems: readonly string[];
    newsletterTitle: string;
    newsletterBody: string;
    newsletterCta: string;
  };
};

export function HomePage({ locale, currency, copy }: HomePageProps) {
  const shapewear = sortProductsByMerchOrder(
    products.filter((product) => product.category === "shapewear")
  ).slice(0, 3);
  const bras = sortProductsByMerchOrder(
    products.filter((product) => product.category === "bras")
  ).slice(0, 2);
  const underwear = sortProductsByMerchOrder(
    products.filter((product) => product.category === "underwear")
  ).slice(0, 2);
  const primaryCategoryEntries = categoryEntries.slice(0, 3);
  const shapewearCategoryEntries = categoryEntries.slice(3);
  const trending = sortProductsByMerchOrder(products);
  const serviceItems = [
    {
      icon: Truck,
      title: "Free Express Shipping",
      body: "On orders over $120+"
    },
    {
      icon: Smartphone,
      title: "Early Access",
      body: "Join the AURELLE list first"
    },
    {
      icon: BadgeCheck,
      title: "Contour Assurance",
      body: "Compression details across the range"
    },
    {
      icon: RotateCcw,
      title: "Returns",
      body: "Within 30 days"
    },
    {
      icon: Sparkles,
      title: "Soft Sculpt",
      body: "Refined support in every layer"
    }
  ];

  return (
    <div className="pb-8">
      <section className="w-full">
        <Link href="/shop?category=shapewear" className="group block overflow-hidden bg-white motion-rise">
          <div className="relative min-h-[100svh] overflow-hidden">
            <PlaceholderImage
              src="/placeholders/hero-main.svg"
              alt="Hero placeholder"
              className="absolute inset-0 min-h-[100svh] rounded-none motion-float"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 via-black/18 to-transparent px-6 py-10 text-white md:px-8 md:py-12">
              <h1 className="max-w-4xl font-display text-5xl leading-[1.02] tracking-[0.05em] md:text-7xl">
                {copy.heroTitle}
              </h1>
              <p className="mt-4 max-w-xl text-base leading-8 text-white/90">{copy.heroBody}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.12em] text-white">
                  {copy.heroCta} <ArrowRight className="h-4 w-4" />
                </span>
                <span className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.12em] text-white/85">
                  {copy.heroSecondary} <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </div>
        </Link>
      </section>

      <section className="relative min-h-[720px] w-full overflow-hidden">
        <Link href="/shop?category=shapewear" className="group block min-h-[720px]">
          <PlaceholderImage src={shapewear[0].image} alt="Shapewear feature" className="min-h-[720px] rounded-none image-zoom" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent px-6 py-8 md:px-8 md:py-10">
            <p className="font-display text-5xl tracking-[0.04em] text-white">Shapewear</p>
            <p className="mt-3 max-w-xl text-sm leading-7 text-white/90">
              Sculpting foundations designed to smooth, contour, and anchor the full collection.
            </p>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.12em] text-white">
              Shop Now <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </Link>
      </section>

      <section className="grid w-full gap-0 md:grid-cols-2">
        <Link href="/shop?category=underwear" className="group relative block min-h-[760px] overflow-hidden">
          <PlaceholderImage src={underwear[0].image} alt="Underwear feature" className="min-h-[760px] rounded-none image-zoom" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent px-6 py-8 md:px-8 md:py-10">
            <p className="font-display text-4xl tracking-[0.04em] text-white">Underwear</p>
            <p className="mt-3 max-w-md text-sm leading-7 text-white/90">Breathable layers with a barely-there finish.</p>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.12em] text-white">
              Shop Now <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </Link>
        <Link href="/shop?category=bras" className="group relative block min-h-[760px] overflow-hidden border-l border-white/20">
          <PlaceholderImage src={bras[0].image} alt="Bras feature" className="min-h-[760px] rounded-none image-zoom" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent px-6 py-8 md:px-8 md:py-10">
            <p className="font-display text-4xl tracking-[0.04em] text-white">Bras</p>
            <p className="mt-3 max-w-md text-sm leading-7 text-white/90">Support that feels polished, never heavy.</p>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.12em] text-white">
              Shop Now <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </Link>
      </section>

      <section className="relative min-h-[620px] w-full overflow-hidden">
        <PlaceholderImage src="/placeholders/brand-story.svg" alt="Best sellers feature" className="min-h-[620px] rounded-none" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent px-6 py-10 md:px-8 md:py-12">
          <p className="font-display text-5xl tracking-[0.04em] text-white">{copy.bestSellerTitle}</p>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/90">The styles everyone loves and keeps coming back to.</p>
          <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.12em] text-white">
            Shop Now <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </section>

      <section className="w-full border-t border-borderSoft bg-white">
        <div className="border-b border-borderSoft px-6 py-6 md:px-8">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#8a8077]">Core Categories</p>
        </div>
        <div className="grid w-full gap-0 md:grid-cols-3">
          {primaryCategoryEntries.map((tile, index) => (
            <Link
              key={tile.label}
              href={tile.href}
              className={`group block border-b border-borderSoft bg-white md:border-b-0 ${
                index < primaryCategoryEntries.length - 1 ? "md:border-r md:border-borderSoft" : ""
              }`}
            >
              <PlaceholderImage src={tile.image} alt={tile.label} className="min-h-[520px] rounded-none image-zoom" />
              <div className="px-4 py-5">
                <p className="font-display text-[28px] tracking-[0.05em] text-[#231f1b]">{tile.label}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="border-y border-borderSoft px-6 py-6 md:px-8">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#8a8077]">Shop Shapewear</p>
        </div>
        <div className="grid w-full gap-0 md:grid-cols-3">
          {shapewearCategoryEntries.map((tile, index) => (
            <Link
              key={tile.label}
              href={tile.href}
              className={`group block border-b border-borderSoft bg-white md:border-b-0 ${
                index < shapewearCategoryEntries.length - 1 ? "md:border-r md:border-borderSoft" : ""
              }`}
            >
              <PlaceholderImage src={tile.image} alt={tile.label} className="min-h-[460px] rounded-none image-zoom" />
              <div className="px-4 py-5">
                <p className="font-display text-[26px] tracking-[0.05em] text-[#231f1b]">{tile.label}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="relative min-h-[680px] w-full overflow-hidden">
        <PlaceholderImage src="/placeholders/fabric-1.svg" alt="Campaign placeholder" className="min-h-[680px] rounded-none" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent px-6 py-10 md:px-8 md:py-12">
          <p className="font-display text-5xl tracking-[0.04em] text-white">AURELLE Studio</p>
          <p className="mt-4 max-w-2xl text-base leading-8 text-white/90">
            Built for sculpted lines in motion. Discover soft-compression silhouettes, smoothing separates, and tonal layers designed for all-day structure.
          </p>
          <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.12em] text-white">
            Shop Now <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </section>

      <section className="w-full bg-white">
        <div className="flex items-center justify-between border-y border-borderSoft px-6 py-8 md:px-8">
          <div className="w-24" />
          <p className="font-display text-[28px] tracking-[0.04em] text-[#231f1b]">Trending</p>
          <p className="text-sm uppercase tracking-[0.12em] text-[#8a8077]">1 / 2</p>
        </div>
        <div className="overflow-x-auto">
          <div className="grid min-w-[1560px] grid-cols-6 border-b border-borderSoft">
            {trending.slice(0, 6).map((product, index) => (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                className={`group border-r border-borderSoft bg-white p-6 motion-rise ${
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
              AURELLE BODY IS A MODERN SHAPEWEAR HOUSE CREATING REFINED SUPPORT FOR EVERYDAY DRESSING.
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
