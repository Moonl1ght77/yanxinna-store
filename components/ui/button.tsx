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
        variant === "primary" && "border-[#5C4E43] bg-[#5C4E43] text-white hover:bg-[#4A3D34]",
        variant === "secondary" && "border-borderSoft bg-[#F5F1ED] text-[#2C2825] hover:bg-[#EDE8E2]",
        variant === "ghost" && "border border-borderSoft bg-white text-[#2C2825] hover:bg-[#FDFBF8]",
        className
      )}
      {...props}
    />
  );
}
