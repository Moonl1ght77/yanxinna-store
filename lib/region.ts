import { regionOptions } from "@/lib/data/locales";

const fallbackRegion = regionOptions[0];

export function getMockRegionByCode(code?: string) {
  return regionOptions.find((option) => option.region === code) ?? fallbackRegion;
}

export async function detectRegionFromIp() {
  return {
    mode: "mock",
    region: fallbackRegion.region,
    locale: fallbackRegion.locale,
    currency: fallbackRegion.currency
  };
}
