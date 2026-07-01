"use client";

import { useLocale } from "@/hooks/use-locale";

export function AnnouncementBar() {
  const { copy } = useLocale();

  return (
    <div className="bg-announcementBg px-4 py-2 text-center text-[10px] font-medium uppercase tracking-[0.22em] text-white sm:text-[11px]">
      {copy.promo}
    </div>
  );
}
