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

  // 获取当前选中颜色的图片
  const currentColorData = useMemo(() => {
    return product.colors.find(c => c.name === selectedColor) || product.colors[0];
  }, [selectedColor, product.colors]);

  // 当前颜色的画廊图片
  const currentGallery = useMemo(() => {
    const colorData = product.colors.find(c => c.name === selectedColor);
    if (colorData) {
      return [colorData.image, colorData.hoverImage];
    }
    return product.gallery;
  }, [selectedColor, product.colors, product.gallery]);

  const compressionWidth = useMemo(() => {
    if (product.compressionLevel === "Light") return "w-1/3";
    if (product.compressionLevel === "Medium") return "w-2/3";
    return "w-full";
  }, [product.compressionLevel]);

  // 切换颜色时更新图片
  const handleColorChange = (colorName: string) => {
    setSelectedColor(colorName);
    const colorData = product.colors.find(c => c.name === colorName);
    if (colorData) {
      setSelectedImage(colorData.image);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <div className="mb-6 overflow-hidden text-ellipsis whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.18em] text-[#A89B8C]">
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
          <PlaceholderImage src={selectedImage} alt={product.name} className="min-h-[400px] rounded-none md:min-h-[680px]" />
          <div className="grid grid-cols-2 gap-4">
            {currentGallery.map((image, index) => (
              <button key={`${selectedColor}-${index}`} onClick={() => setSelectedImage(image)} className="text-left">
                <PlaceholderImage src={image} alt={`${product.name} ${selectedColor} view`} className="min-h-[150px] rounded-none md:min-h-[200px]" />
              </button>
            ))}
          </div>
        </div>

        <div className="border border-borderSoft bg-white p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#A89B8C]">{product.category}</p>
            {product.subcategory ? (
              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#A89B8C]">/ {product.subcategory}</p>
            ) : null}
            {product.badge ? (
              <span className="border border-borderSoft px-2 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[#6B5E52]">
                {product.badge}
              </span>
            ) : null}
          </div>
          <h1 className="mt-3 font-display text-3xl leading-tight tracking-[0.04em] text-[#2C2825] sm:text-4xl md:text-5xl">{product.name}</h1>
          <div className="mt-5 flex items-center gap-3">
            <p className="text-xl text-[#2C2825]">{formatPrice(product.price, currency, locale)}</p>
            {product.compareAtPrice ? (
              <p className="text-sm text-[#9b928a] line-through">
                {formatPrice(product.compareAtPrice, currency, locale)}
              </p>
            ) : null}
          </div>
          <p className="mt-6 text-sm leading-7 text-[#8A7F73]">{product.description}</p>

          <div className="mt-8">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#A89B8C]">{copy.color}: {selectedColor}</p>
            <div className="mt-3 flex flex-wrap gap-3">
              {product.colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => handleColorChange(color.name)}
                  className={`flex items-center gap-2 border px-3 py-2 text-sm transition-all duration-300 ${
                    selectedColor === color.name ? "border-[#5C4E43] bg-[#5C4E43] text-white" : "border-borderSoft hover:border-[#A89B8C]"
                  }`}
                >
                  <span className="h-4 w-4 rounded-full border border-black/10" style={{ backgroundColor: color.hex }} />
                  {color.name}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#A89B8C]">{copy.size}</p>
            <div className="mt-3 flex flex-wrap gap-3">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`border px-4 py-2 text-sm ${
                    selectedSize === size ? "border-[#5C4E43] bg-[#5C4E43] text-white" : "border-borderSoft text-[#2C2825]"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            <p className="mt-4 text-sm leading-6 text-[#A89B8C]">{copy.sizeGuide}</p>
          </div>

          <div className="mt-8 flex items-center justify-between border border-borderSoft bg-[#FDFBF8] p-4">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#A89B8C]">{copy.quantityLabel}</p>
              <p className="mt-1 text-sm text-[#6B5E52]">{copy.sizeGuide}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                className="border border-borderSoft p-2"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="min-w-6 text-center text-sm text-[#2C2825]">{quantity}</span>
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

          <div className="mt-10 border border-borderSoft bg-[#F5F1ED] p-5">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#A89B8C]">{copy.compressionLevel}</p>
            <div className="mt-4 h-2 bg-white">
              <div className={`${compressionWidth} h-2 bg-[#5C4E43]`} />
            </div>
            <p className="mt-3 text-sm text-[#6B5E52]">{product.compressionLevel}</p>
          </div>

          <div className="mt-8 grid gap-3 border-t border-borderSoft pt-8">
            {product.benefits.map((benefit) => (
              <div key={benefit} className="flex items-center gap-3 border border-borderSoft bg-[#FDFBF8] px-4 py-3 text-sm text-[#6B5E52]">
                <span className="h-2 w-2 rounded-full bg-[#5C4E43]" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-4 border-t border-borderSoft pt-8 text-sm leading-7 text-[#8A7F73]">
            <div className="flex items-start justify-between gap-4 border-b border-borderSoft pb-4">
              <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#A89B8C]">{copy.footerShipping}</span>
              <span className="max-w-[70%] text-right">{copy.footerShipping} {copy.footerReturns}</span>
            </div>
            <div className="flex items-start justify-between gap-4 border-b border-borderSoft pb-4">
              <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#A89B8C]">{copy.footerReturns}</span>
              <span className="max-w-[70%] text-right">{copy.footerReturns}</span>
            </div>
          </div>

          <div className="mt-8 grid gap-6 border-t border-borderSoft pt-8">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#A89B8C]">{copy.series}</p>
              <p className="mt-2 text-sm leading-7 text-[#8A7F73]">{product.shortDescription}</p>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#A89B8C]">{copy.materialCare}</p>
              <p className="mt-2 text-sm leading-7 text-[#8A7F73]">
                {product.fabric}
                <br />
                {product.care}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#A89B8C]">Reviews</p>
              <p className="mt-2 text-sm leading-7 text-[#A89B8C]">{copy.reviews}</p>
            </div>
          </div>
        </div>
      </div>

      <section className="mt-14">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-2xl tracking-[0.04em] text-[#2C2825] sm:text-3xl md:text-4xl">{copy.completeLook}</h2>
          <Link href="/shop" className="text-sm uppercase tracking-[0.12em] text-[#6B5E52]">
            {copy.continueShopping}
          </Link>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {completeTheLook.map((item) => (
            <Link key={item.id} href={`/product/${item.slug}`} className="border border-borderSoft bg-white p-4">
              <PlaceholderImage src={item.image} alt={item.name} className="min-h-[320px] rounded-none image-zoom" />
              <p className="mt-4 text-[11px] font-medium uppercase tracking-[0.2em] text-[#A89B8C]">
                {item.subcategory ? `${item.category} / ${item.subcategory}` : item.category}
              </p>
              <p className="mt-4 text-lg text-[#2C2825]">{item.name}</p>
              <p className="mt-2 text-sm text-[#6B5E52]">{formatPrice(item.price, currency, locale)}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
