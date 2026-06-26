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
        variant === "primary" && "border-[#231f1b] bg-[#231f1b] text-white hover:bg-[#342f2a]",
        variant === "secondary" && "border-borderSoft bg-[#f2f5f9] text-[#231f1b] hover:bg-[#e8edf4]",
        variant === "ghost" && "border border-borderSoft bg-white text-[#231f1b] hover:bg-[#faf8f5]",
        className
      )}
      {...props}
    />
  );
}
