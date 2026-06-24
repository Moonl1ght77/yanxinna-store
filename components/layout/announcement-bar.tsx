"use client";

import { usePathname } from "next/navigation";
import { useLocale } from "@/hooks/use-locale";

export function AnnouncementBar() {
  const { copy } = useLocale();
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <div
      className={`px-4 py-3 text-center text-[11px] font-medium uppercase tracking-[0.22em] ${
        isHome
          ? "absolute inset-x-0 top-0 z-40 border-b border-black/10 bg-transparent text-[#231f1b]"
          : "border-b border-borderSoft bg-white text-[#5f5852]"
      }`}
    >
      {copy.promo}
    </div>
  );
}
