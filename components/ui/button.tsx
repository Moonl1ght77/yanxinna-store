import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center border px-5 py-3 text-[11px] font-medium uppercase tracking-[0.22em] transition",
        variant === "primary" && "border-navBg bg-navBg text-white hover:bg-accentHover",
        variant === "secondary" && "border-borderSoft bg-surface text-fg hover:bg-surface2",
        variant === "ghost" && "border border-borderSoft bg-card text-fg hover:bg-surface",
        className
      )}
      {...props}
    />
  );
}
