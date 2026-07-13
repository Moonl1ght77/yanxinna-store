import { regionOptions } from "@/lib/data/locales";

const fallbackRegion = regionOptions[0];

export function getMockRegionByCode(code?: string) {
  return regionOptions.find((option) => option.region === code) ?? fallbackRegion;
}

/**
 * 根据 IP 自动检测用户所在地区
 * 使用 ip-api.com 免费 API（无需 API Key）
 */
export async function detectRegionFromIp(): Promise<{
  mode: "detected" | "fallback";
  region: string;
  locale: string;
  currency: string;
}> {
  // 如果在客户端，尝试使用浏览器语言作为快速检测
  if (typeof window !== "undefined") {
    const browserLang = navigator.language || navigator.languages?.[0] || "";

    if (browserLang.startsWith("ru")) {
      return { mode: "detected", region: "RU", locale: "ru-RU", currency: "RUB" };
    }
    if (browserLang.startsWith("fr")) {
      return { mode: "detected", region: "FR", locale: "fr-FR", currency: "EUR" };
    }
    if (browserLang.startsWith("de")) {
      return { mode: "detected", region: "DE", locale: "de-DE", currency: "EUR" };
    }
    if (browserLang.startsWith("en")) {
      // 英语用户默认美国
      return { mode: "detected", region: "US", locale: "en-US", currency: "USD" };
    }
  }

  try {
    // ipwho.is 支持 HTTPS 免费调用（ip-api.com 免费版仅 HTTP，会被 HTTPS 页面 mixed content 拦截）
    const response = await fetch("https://ipwho.is/?fields=country_code,success", {
      signal: AbortSignal.timeout(2000) // 2秒超时
    });

    if (!response.ok) {
      throw new Error("IP API request failed");
    }

    const data = await response.json();

    if (!data.success || !data.country_code) {
      throw new Error("IP detection failed");
    }

    const countryCode = data.country_code.toUpperCase();
    const matchedRegion = regionOptions.find((r) => r.region === countryCode);

    if (matchedRegion) {
      return {
        mode: "detected",
        region: matchedRegion.region,
        locale: matchedRegion.locale,
        currency: matchedRegion.currency
      };
    }

    // 英语国家默认 US，欧洲国家根据语言判断
    const englishCountries = ["US", "CA", "AU", "NZ", "IE", "ZA"];
    const frenchCountries = ["FR", "BE", "CH", "CA", "LU"];
    const germanCountries = ["DE", "AT", "CH", "LI", "LU"];

    if (englishCountries.includes(countryCode)) {
      return { mode: "detected", region: "US", locale: "en-US", currency: "USD" };
    }
    if (frenchCountries.includes(countryCode)) {
      return { mode: "detected", region: "FR", locale: "fr-FR", currency: "EUR" };
    }
    if (germanCountries.includes(countryCode)) {
      return { mode: "detected", region: "DE", locale: "de-DE", currency: "EUR" };
    }

    return {
      mode: "detected",
      region: fallbackRegion.region,
      locale: fallbackRegion.locale,
      currency: fallbackRegion.currency
    };
  } catch (error) {
    console.warn("IP detection failed, using fallback:", error);
    return {
      mode: "fallback",
      region: fallbackRegion.region,
      locale: fallbackRegion.locale,
      currency: fallbackRegion.currency
    };
  }
}
