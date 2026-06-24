"use client";

import { createContext, useEffect, useMemo, useState } from "react";
import { copyByLocale, regionOptions } from "@/lib/data/locales";
import { getMockRegionByCode } from "@/lib/region";
import { LocaleCode } from "@/types/locale";

type LocaleContextValue = {
  region: string;
  locale: LocaleCode;
  currency: string;
  copy: (typeof copyByLocale)[LocaleCode];
  setRegion: (region: string) => void;
};

export const LocaleContext = createContext<LocaleContextValue | null>(null);

const storageKey = "aurelle-region";

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [region, setRegionState] = useState("US");

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (saved) {
      setRegionState(saved);
    }
  }, []);

  const setRegion = (nextRegion: string) => {
    setRegionState(nextRegion);
    window.localStorage.setItem(storageKey, nextRegion);
  };

  const value = useMemo<LocaleContextValue>(() => {
    const selected = getMockRegionByCode(region);
    return {
      region: selected.region,
      locale: selected.locale,
      currency: selected.currency,
      copy: copyByLocale[selected.locale],
      setRegion
    };
  }, [region]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function getRegionOptions() {
  return regionOptions;
}
