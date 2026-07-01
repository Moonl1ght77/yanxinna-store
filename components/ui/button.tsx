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
        variant === "primary" && "border-[#5C4E43] bg-[#5C4E43] text-white hover:bg-[#4A3D34] dark:border-[#C9B99A] dark:bg-[#C9B99A] dark:text-[#1A1816] dark:hover:bg-[#E8DFC8]",
        variant === "secondary" && "border-borderSoft bg-blueMist text-foreground hover:bg-blueSoft",
        variant === "ghost" && "border border-borderSoft bg-cardBg text-foreground hover:bg-blueMist",
        className
      )}
      {...props}
    />
  );
}
