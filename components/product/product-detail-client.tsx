"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Minus, Plus } from "lucide-react";
import { Product } from "@/types/product";
import { formatPrice, titleCase } from "@/lib/utils";
import { PlaceholderImage } from "@/components/ui/placeholder-image";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useLocale } from "@/hooks/use-locale";

type ProductDetailClientProps = {
  product: Product;
  completeTheLook: Product[];
};

export function ProductDetailClient({
  product,
  completeTheLook
}: ProductDetailClientProps) {
  const [selectedImage, setSelectedImage] = useState(product.gallery[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0].name);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { locale, currency, copy } = useLocale();

  const compressionWidth = useMemo(() => {
    if (product.compressionLevel === "Light") return "w-1/3";
    if (product.compressionLevel === "Medium") return "w-2/3";
    return "w-full";
  }, [product.compressionLevel]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <div className="mb-6 text-[11px] font-medium uppercase tracking-[0.18em] text-[#8a8077]">
        <Link href="/">{copy.breadcrumbHome}</Link> / <Link href="/shop">{copy.breadcrumbShop}</Link> /{" "}
        <Link href={`/shop?category=${product.category}`}>{titleCase(product.category)}</Link>
        {product.subcategory ? (
          <>
            {" "}
            / <Link href={`/shop?category=shapewear&subcategory=${product.subcategory}`}>{titleCase(product.subcategory)}</Link>
          </>
        ) : null}{" "}
        / {product.name}
      </div>
      <div className="grid gap-8 md:grid-cols-[1.1fr,0.9fr]">
        <div className="space-y-4">
          <PlaceholderImage src={selectedImage} alt={product.name} className="min-h-[680px] rounded-none" />
          <div className="grid grid-cols-3 gap-4">
            {product.gallery.map((image) => (
              <button key={image} onClick={() => setSelectedImage(image)} className="text-left">
                <PlaceholderImage src={image} alt={`${product.name} view`} className="min-h-[170px] rounded-none" />
              </button>
            ))}
          </div>
        </div>

        <div className="border border-borderSoft bg-white p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#8a8077]">{product.category}</p>
            {product.subcategory ? (
              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#8a8077]">/ {product.subcategory}</p>
            ) : null}
            {product.badge ? (
              <span className="border border-borderSoft px-2 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[#524a43]">
                {product.badge}
              </span>
            ) : null}
          </div>
          <h1 className="mt-3 font-display text-5xl leading-tight tracking-[0.04em] text-[#231f1b]">{product.name}</h1>
          <div className="mt-5 flex items-center gap-3">
            <p className="text-xl text-[#231f1b]">{formatPrice(product.price, currency, locale)}</p>
            {product.compareAtPrice ? (
              <p className="text-sm text-[#9b928a] line-through">
                {formatPrice(product.compareAtPrice, currency, locale)}
              </p>
            ) : null}
          </div>
          <p className="mt-6 text-sm leading-7 text-[#6b635d]">{product.description}</p>

          <div className="mt-8">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#8a8077]">{copy.color}</p>
            <div className="mt-3 flex flex-wrap gap-3">
              {product.colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color.name)}
                  className={`flex items-center gap-2 border px-3 py-2 text-sm ${
                    selectedColor === color.name ? "border-[#231f1b]" : "border-borderSoft"
                  }`}
                >
                  <span className="h-4 w-4 rounded-full border border-black/10" style={{ backgroundColor: color.hex }} />
                  {color.name}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#8a8077]">{copy.size}</p>
            <div className="mt-3 flex flex-wrap gap-3">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`border px-4 py-2 text-sm ${
                    selectedSize === size ? "border-[#231f1b] bg-[#231f1b] text-white" : "border-borderSoft text-[#231f1b]"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            <p className="mt-4 text-sm leading-6 text-[#8a8077]">{copy.sizeGuide}</p>
          </div>

          <div className="mt-8 flex items-center justify-between border border-borderSoft bg-[#faf8f5] p-4">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#8a8077]">{copy.quantityLabel}</p>
              <p className="mt-1 text-sm text-[#524a43]">{copy.sizeGuide}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                className="border border-borderSoft p-2"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="min-w-6 text-center text-sm text-[#231f1b]">{quantity}</span>
              <button
                onClick={() => setQuantity((current) => current + 1)}
                className="border border-borderSoft p-2"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-8">
            <Button
              className="w-full"
              onClick={() =>
                addItem({
                  productId: product.id,
                  slug: product.slug,
                  name: product.name,
                  image: product.image,
                  price: product.price,
                  color: selectedColor,
                  size: selectedSize,
                  quantity
                })
              }
            >
              {copy.addToCart}
            </Button>
          </div>

          <div className="mt-10 border border-borderSoft bg-[#f7f6f4] p-5">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#8a8077]">{copy.compressionLevel}</p>
            <div className="mt-4 h-2 bg-white">
              <div className={`${compressionWidth} h-2 bg-[#231f1b]`} />
            </div>
            <p className="mt-3 text-sm text-[#524a43]">{product.compressionLevel}</p>
          </div>

          <div className="mt-8 grid gap-3 border-t border-borderSoft pt-8">
            {product.benefits.map((benefit) => (
              <div key={benefit} className="flex items-center gap-3 border border-borderSoft bg-[#faf8f5] px-4 py-3 text-sm text-[#524a43]">
                <span className="h-2 w-2 rounded-full bg-[#231f1b]" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-4 border-t border-borderSoft pt-8 text-sm leading-7 text-[#6b635d]">
            <div className="flex items-start justify-between gap-4 border-b border-borderSoft pb-4">
              <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#8a8077]">{copy.footerShipping}</span>
              <span className="max-w-[70%] text-right">{copy.footerShipping} {copy.footerReturns}</span>
            </div>
            <div className="flex items-start justify-between gap-4 border-b border-borderSoft pb-4">
              <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#8a8077]">{copy.footerReturns}</span>
              <span className="max-w-[70%] text-right">{copy.footerReturns}</span>
            </div>
          </div>

          <div className="mt-8 grid gap-6 border-t border-borderSoft pt-8">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#8a8077]">{copy.series}</p>
              <p className="mt-2 text-sm leading-7 text-[#6b635d]">{product.shortDescription}</p>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#8a8077]">{copy.materialCare}</p>
              <p className="mt-2 text-sm leading-7 text-[#6b635d]">
                {product.fabric}
                <br />
                {product.care}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#8a8077]">Reviews</p>
              <p className="mt-2 text-sm leading-7 text-[#8a8077]">{copy.reviews}</p>
            </div>
          </div>
        </div>
      </div>

      <section className="mt-14">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-4xl tracking-[0.04em] text-[#231f1b]">{copy.completeLook}</h2>
          <Link href="/shop" className="text-sm uppercase tracking-[0.12em] text-[#524a43]">
            {copy.continueShopping}
          </Link>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {completeTheLook.map((item) => (
            <Link key={item.id} href={`/product/${item.slug}`} className="border border-borderSoft bg-white p-4">
              <PlaceholderImage src={item.image} alt={item.name} className="min-h-[320px] rounded-none image-zoom" />
              <p className="mt-4 text-[11px] font-medium uppercase tracking-[0.2em] text-[#8a8077]">
                {item.subcategory ? `${item.category} / ${item.subcategory}` : item.category}
              </p>
              <p className="mt-4 text-lg text-[#231f1b]">{item.name}</p>
              <p className="mt-2 text-sm text-[#524a43]">{formatPrice(item.price, currency, locale)}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
