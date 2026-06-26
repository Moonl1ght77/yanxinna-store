"use client";

import { cn } from "@/lib/utils";
import { useLocale } from "@/hooks/use-locale";
import { getRegionOptions } from "@/providers/locale-provider";

type LocaleRegionSwitcherProps = {
  className?: string;
  selectClassName?: string;
};

export function LocaleRegionSwitcher({ className, selectClassName }: LocaleRegionSwitcherProps) {
  const { region, setRegion, copy } = useLocale();

  return (
    <label className={cn("flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-[#6c645d]", className)}>
      {copy.footerCountry}
      <select
        value={region}
        onChange={(event) => setRegion(event.target.value)}
        className={cn(
          "border border-borderSoft bg-white px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-[#231f1b] outline-none",
          selectClassName
        )}
      >
        {getRegionOptions().map((option) => (
          <option key={option.region} value={option.region}>
            {option.region}
          </option>
        ))}
      </select>
    </label>
  );
}
