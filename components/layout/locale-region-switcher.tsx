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
        <div className="absolute right-0 top-full z-50 mt-1 w-full min-w-[140px] rounded border border-[#d9d9d9] bg-white shadow-md">
          {options.map((option) => (
            <button
              key={option.region}
              onClick={() => {
                setRegion(option.region);
                setIsOpen(false);
              }}
              className={cn(
                "flex w-full items-center gap-3 px-4 py-2.5 text-[12px] uppercase tracking-[0.1em] text-[#333333] transition hover:bg-[#f0f0f0]",
                option.region === region && "bg-[#f0f0f0] font-semibold text-[#111111]"
              )}
            >
              <Image
                src={flagMap[option.region]}
                alt={option.region}
                width={24}
                height={16}
                className="h-[16px] w-[24px] object-cover rounded-[2px]"
              />
              <span>{option.region}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
