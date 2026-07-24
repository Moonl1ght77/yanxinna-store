"use client";

import { useMemo, useState, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import type { ProductRecord } from "@/types/product";
import { titleCase } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/hooks/use-locale";
import { localizeProduct } from "@/lib/wordpress/localize";
import { SampleRequestModal } from "@/components/ui/sample-request-modal";

type ProductDetailClientProps = {
  product: ProductRecord;
  completeTheLook: ProductRecord[];
};

export function ProductDetailClient({
  product: productRecord,
  completeTheLook: completeTheLookRecords
}: ProductDetailClientProps) {
  const { locale, copy } = useLocale();
  const product = localizeProduct(productRecord, locale);
  const completeTheLook = completeTheLookRecords.map((item) =>
    localizeProduct(item, locale)
  );
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const selectedColor = product.colors[selectedColorIndex] ?? product.colors[0];

  // 当前颜色的画廊图片
  const currentGallery = useMemo(() => {
    const colorData = product.colors[selectedColorIndex];
    if (colorData) {
      return [colorData.image, colorData.hoverImage];
    }
    return product.gallery;
  }, [selectedColorIndex, product.colors, product.gallery]);

  const compressionWidth = useMemo(() => {
    if (product.compressionLevel === "Light") return "w-1/3";
    if (product.compressionLevel === "Medium") return "w-2/3";
    return "w-full";
  }, [product.compressionLevel]);

  // 切换颜色时更新图片
  const handleColorChange = (colorIndex: number) => {
    setSelectedColorIndex(colorIndex);
    setCurrentImageIndex(0);
  };

  // 滑动切换图片
  const goToImage = useCallback((index: number) => {
    const newIndex = Math.max(0, Math.min(index, currentGallery.length - 1));
    setCurrentImageIndex(newIndex);
  }, [currentGallery]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        // 向左滑 - 下一张
        goToImage(currentImageIndex + 1);
      } else {
        // 向右滑 - 上一张
        goToImage(currentImageIndex - 1);
      }
    }
  };

  const goToPrev = () => goToImage(currentImageIndex - 1);
  const goToNext = () => goToImage(currentImageIndex + 1);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <SampleRequestModal
        isOpen={showInquiryModal}
        onClose={() => setShowInquiryModal(false)}
        product={{
          name: product.name,
          productNumber: product.productNumber,
          color: selectedColor.name,
          size: selectedSize
        }}
      />
      <div className="mb-6 overflow-hidden text-ellipsis whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.18em] text-[#A89B8C]">
        <Link href="/">{copy.breadcrumbHome}</Link> / <Link href="/shop">{copy.breadcrumbShop}</Link> /{" "}
        <Link href={`/shop?category=${product.category}`}>{titleCase(product.category)}</Link>
        {product.subcategory ? (
          <>
            {" "}
            / <Link href={`/shop?category=${product.category}&subcategory=${product.subcategory}`}>{titleCase(product.subcategory)}</Link>
          </>
        ) : null}{" "}
        / {product.name}
      </div>
      <div className="grid gap-8 md:grid-cols-[1.1fr,0.9fr]">
        <div className="space-y-4">
          {/* 主图 - 轮播效果 */}
          <div
            className="relative aspect-[3/4] overflow-hidden bg-[#f5f5f5]"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* 图片轮播容器 */}
            <div
              className="flex h-full transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
            >
              {currentGallery.map((image, index) => (
                <div key={`${selectedColor.name}-${index}`} className="relative h-full w-full flex-shrink-0">
                  <Image
                    src={image}
                    alt={`${product.name} ${selectedColor.name} view ${index + 1}`}
                    fill
                    className="object-contain p-4"
                    sizes="(max-width: 768px) 100vw, 55vw"
                    priority={index === 0}
                  />
                </div>
              ))}
            </div>

            {/* 左右箭头 */}
            {currentImageIndex > 0 && (
              <button
                onClick={goToPrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 shadow-md transition hover:bg-white md:left-4 z-10"
              >
                <ChevronLeft className="h-5 w-5 text-[#2C2825]" />
              </button>
            )}
            {currentImageIndex < currentGallery.length - 1 && (
              <button
                onClick={goToNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 shadow-md transition hover:bg-white md:right-4 z-10"
              >
                <ChevronRight className="h-5 w-5 text-[#2C2825]" />
              </button>
            )}

            {/* 指示器 */}
            {currentGallery.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {currentGallery.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToImage(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentImageIndex ? "w-6 bg-[#2C2825]" : "w-2 bg-[#2C2825]/30"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {currentGallery.map((image, index) => (
              <button
                key={`${selectedColor.name}-${index}`}
                onClick={() => goToImage(index)}
                className={`relative aspect-square overflow-hidden bg-[#f5f5f5] border-2 transition-all duration-300 ${
                  index === currentImageIndex ? "border-[#2C2825]" : "border-transparent"
                }`}
              >
                <Image
                  src={image}
                  alt={`${product.name} ${selectedColor.name} view`}
                  fill
                  className="object-contain p-2"
                  sizes="(max-width: 768px) 50vw, 25vw"
                  priority={index === 0}
                />
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
            <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#A89B8C]">
              {product.productNumber}
            </span>
          </div>
          <h1 className="mt-3 font-display text-3xl/[1.15] tracking-[0.04em] text-[#2C2825] sm:text-4xl/[1.15] md:text-5xl/[1.15]">{product.name}</h1>
          {/* description 来自 WordPress WYSIWYG，API 侧已过 wp_kses_post 白名单清洗 */}
          <div
            className="mt-6 text-sm leading-7 text-[#8A7F73] [&_p+p]:mt-4"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />

          <div className="mt-8">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#A89B8C]">{copy.color}: {selectedColor.name}</p>
            <div className="mt-3 flex flex-wrap gap-3">
              {product.colors.map((color, colorIndex) => (
                <button
                  key={color.name}
                  onClick={() => handleColorChange(colorIndex)}
                  className={`flex items-center gap-2 border px-3 py-2 text-sm transition-all duration-300 ${
                    selectedColorIndex === colorIndex ? "border-[#5C4E43] bg-[#5C4E43] text-white" : "border-borderSoft hover:border-[#A89B8C]"
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

          <div className="mt-8">
            <Button
              className="w-full"
              onClick={() => setShowInquiryModal(true)}
            >
              {copy.factoryRequestSample}
            </Button>
          </div>

          {product.compressionLevel ? (
            <div className="mt-10 border border-borderSoft bg-[#F5F1ED] p-5">
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#A89B8C]">{copy.compressionLevel}</p>
              <div className="mt-4 h-2 bg-white">
                <div className={`${compressionWidth} h-2 bg-[#5C4E43]`} />
              </div>
              <p className="mt-3 text-sm text-[#6B5E52]">{product.compressionLevel}</p>
            </div>
          ) : null}

          <div className="mt-8 grid gap-3 border-t border-borderSoft pt-8">
            {product.benefits.map((benefit) => (
              <div key={benefit} className="flex items-center gap-3 border border-borderSoft bg-[#FDFBF8] px-4 py-3 text-sm text-[#6B5E52]">
                <span className="h-2 w-2 rounded-full bg-[#5C4E43]" />
                <span>{benefit}</span>
              </div>
            ))}
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
            {product.parameters.map((parameter) => (
              <div key={`${parameter.label}-${parameter.value}`}>
                <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#A89B8C]">{parameter.label}</p>
                <p className="mt-2 text-sm leading-7 text-[#8A7F73]">{parameter.value}</p>
              </div>
            ))}
            {product.attachments.map((attachment) => (
              <a
                key={attachment.url}
                href={attachment.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm text-[#6B5E52] underline-offset-4 hover:underline"
              >
                <Download className="h-4 w-4" />
                {attachment.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <section className="mt-14">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-2xl tracking-[0.04em] text-[#2C2825] sm:text-3xl md:text-4xl">{copy.completeLook}</h2>
          <Link href="/shop" className="text-sm uppercase tracking-[0.12em] text-[#6B5E52]">
            {copy.breadcrumbShop}
          </Link>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {completeTheLook.map((item) => (
            <Link key={item.id} href={`/product/${item.slug}`} className="border border-borderSoft bg-white p-4">
              <div className="relative aspect-[3/4] overflow-hidden bg-[#f5f5f5]">
                <Image src={item.image} alt={item.name} fill className="object-contain p-4" sizes="(max-width: 768px) 100vw, 33vw" />
              </div>
              <p className="mt-4 text-[11px] font-medium uppercase tracking-[0.2em] text-[#A89B8C]">
                {item.subcategory ? `${item.category} / ${item.subcategory}` : item.category}
              </p>
              <p className="mt-4 text-lg text-[#2C2825]">{item.name}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
