"use client";

import { createContext, useEffect, useMemo, useState } from "react";
import { copyByLocale, regionOptions } from "@/lib/data/locales";
import { getMockRegionByCode, detectRegionFromIp } from "@/lib/region";
import { LocaleCode } from "@/types/locale";

type LocaleContextValue = {
  region: string;
  locale: LocaleCode;
  currency: string;
  copy: (typeof copyByLocale)[LocaleCode];
  setRegion: (region: string) => void;
};

export const LocaleContext = createContext<LocaleContextValue | null>(null);

const storageKey = "yanxinna-region";
const ipDetectedKey = "yanxinna-ip-detected";
const cookieMaxAge = 60 * 60 * 24 * 365;

function persistRegionCookie(region: string) {
  document.cookie = `${storageKey}=${encodeURIComponent(region)}; Path=/; Max-Age=${cookieMaxAge}; SameSite=Lax`;
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [region, setRegionState] = useState("RU");
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      // 1. 先检查是否有用户手动保存的选择
      const saved = window.localStorage.getItem(storageKey);
      if (saved) {
        setRegionState(saved);
        persistRegionCookie(saved);
        setIsInitialized(true);
        return;
      }

      // 2. 检查是否已经做过 IP 检测（避免重复请求）
      const alreadyDetected = window.localStorage.getItem(ipDetectedKey);
      if (alreadyDetected) {
        setRegionState(alreadyDetected);
        persistRegionCookie(alreadyDetected);
        setIsInitialized(true);
        return;
      }

      // 3. 首次访问，通过 IP 自动检测地区
      try {
        const detected = await detectRegionFromIp();
        setRegionState(detected.region);
        persistRegionCookie(detected.region);
        // 标记已检测过
        window.localStorage.setItem(ipDetectedKey, detected.region);
      } catch {
        // 检测失败，保持默认 RU
      }

      setIsInitialized(true);
    };

    init();
  }, []);

  const setRegion = (nextRegion: string) => {
    setRegionState(nextRegion);
    persistRegionCookie(nextRegion);
    window.localStorage.setItem(storageKey, nextRegion);
    // 手动选择后也更新 ip-detected 标记，避免下次刷新被覆盖
    window.localStorage.setItem(ipDetectedKey, nextRegion);
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
