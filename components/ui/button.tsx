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
        variant === "primary" && "border-[#5C4E43] bg-[#5C4E43] text-white hover:bg-[#4A3D34] dark:border-[#C9B99A] dark:bg-[#C9B99A] dark:text-[#1E1B18] dark:hover:bg-[#E8DFC8]",
        variant === "secondary" && "border-[#E5DFD8] bg-[#F5F1ED] text-[#2C2825] hover:bg-[#EDE8E2] dark:border-[#3D3530] dark:bg-[#2A2520] dark:text-[#E8E2DA] dark:hover:bg-[#352F28]",
        variant === "ghost" && "border border-[#E5DFD8] bg-white text-[#2C2825] hover:bg-[#F5F1ED] dark:border-[#3D3530] dark:bg-[#2A2520] dark:text-[#E8E2DA] dark:hover:bg-[#352F28]",
        className
      )}
      {...props}
    />
  );
}
