"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

type ProductCardImageProps = {
  src: string;
  hoverSrc?: string;
  alt: string;
  className?: string;
  sizes?: string;
};

export function ProductCardImage({
  src,
  hoverSrc,
  alt,
  className,
  sizes = "(max-width: 768px) 100vw, 50vw"
}: ProductCardImageProps) {
  if (!hoverSrc) {
    return (
      <div className={cn("relative overflow-hidden bg-[#f5f5f5]", className)}>
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes={sizes}
        />
      </div>
    );
  }

  return (
    <div className={cn("group/product relative overflow-hidden bg-[#f5f5f5]", className)}>
      {/* 默认模特图 */}
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover transition-all duration-700 ease-out group-hover/product:opacity-0 group-hover/product:scale-105"
        sizes={sizes}
      />
      {/* 悬停产品图 */}
      <Image
        src={hoverSrc}
        alt={alt}
        fill
        className="object-cover opacity-0 transition-all duration-700 ease-out group-hover/product:opacity-100 group-hover/product:scale-100"
        sizes={sizes}
      />
    </div>
  );
}
