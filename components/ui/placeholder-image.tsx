import Image from "next/image";
import { cn } from "@/lib/utils";

export function PlaceholderImage({
  src,
  alt,
  className,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw"
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <div className={cn("relative overflow-hidden bg-[#eef1f6]", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes={sizes}
        priority={priority}
        loading={priority ? "eager" : "lazy"}
      />
    </div>
  );
}
