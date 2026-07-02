"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale } from "@/hooks/use-locale";
import { getRegionOptions } from "@/providers/locale-provider";

const flagMap: Record<string, string> = {
  RU: "/images/flags/ru.png",
  US: "/images/flags/us.png",
  GB: "/images/flags/gb.png",
  FR: "/images/flags/fr.png",
  DE: "/images/flags/de.png",
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
          "flex items-center gap-2 border px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] outline-none transition hover:bg-[#f5f5f5]",
          selectClassName
        )}
      >
        <Image
          src={flagMap[region]}
          alt={region}
          width={20}
          height={14}
          className="h-[14px] w-[20px] object-cover"
        />
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
              <Image
                src={flagMap[option.region]}
                alt={option.region}
                width={20}
                height={14}
                className="h-[14px] w-[20px] object-cover"
              />
              <span>{option.region}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
