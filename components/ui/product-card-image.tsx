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
        src={hoverSrc}
        alt={alt}
        fill
        className="object-contain p-4 transition-all duration-700 ease-out group-hover/product:opacity-0"
        sizes={sizes}
      />
      {/* 悬停产品图 */}
      <Image
        src={src}
        alt={alt}
        fill
        className="object-contain p-4 opacity-0 transition-all duration-700 ease-out group-hover/product:opacity-100"
        sizes={sizes}
      />
    </div>
  );
}
