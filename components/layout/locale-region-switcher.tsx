"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale } from "@/hooks/use-locale";
import { getRegionOptions } from "@/providers/locale-provider";

const flagMap: Record<string, string> = {
  RU: "🇷🇺",
  US: "🇺🇸",
  GB: "🇬🇧",
  FR: "🇫🇷",
  DE: "🇩🇪",
};

type LocaleRegionSwitcherProps = {
  className?: string;
  selectClassName?: string;
};

export function LocaleRegionSwitcher({ className, selectClassName }: LocaleRegionSwitcherProps) {
  const { region, setRegion, copy } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const options = getRegionOptions();
  const currentOption = options.find((o) => o.region === region);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 border px-3 py-2 text-[11px] uppercase tracking-[0.18em] outline-none transition hover:bg-[#f5f5f5]",
          selectClassName
        )}
      >
        <span className="text-base leading-none">{flagMap[region]}</span>
        <span>{region}</span>
        <ChevronDown className={cn("h-3 w-3 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-1 w-full min-w-[120px] border border-[#e5e5e5] bg-white shadow-lg">
          {options.map((option) => (
            <button
              key={option.region}
              onClick={() => {
                setRegion(option.region);
                setIsOpen(false);
              }}
              className={cn(
                "flex w-full items-center gap-2 px-3 py-2 text-[11px] uppercase tracking-[0.18em] transition hover:bg-[#f5f5f5]",
                option.region === region && "bg-[#f5f5f5] font-medium"
              )}
            >
              <span className="text-base leading-none">{flagMap[option.region]}</span>
              <span>{option.region}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
