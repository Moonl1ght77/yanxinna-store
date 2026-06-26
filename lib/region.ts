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
  try {
    const response = await fetch("http://ip-api.com/json/?fields=countryCode,status", {
      signal: AbortSignal.timeout(3000) // 3秒超时
    });

    if (!response.ok) {
      throw new Error("IP API request failed");
    }

    const data = await response.json();

    if (data.status !== "success" || !data.countryCode) {
      throw new Error("IP detection failed");
    }

    // 将国家代码映射到我们的 region
    const countryCode = data.countryCode.toUpperCase();
    const matchedRegion = regionOptions.find((r) => r.region === countryCode);

    if (matchedRegion) {
      return {
        mode: "detected",
        region: matchedRegion.region,
        locale: matchedRegion.locale,
        currency: matchedRegion.currency
      };
    }

    // 国家代码不在支持列表中，尝试语言匹配
    // 英语国家默认 US，欧洲国家根据语言判断
    const englishCountries = ["US", "CA", "AU", "NZ", "IE", "ZA"];
    const frenchCountries = ["FR", "BE", "CH", "CA", "LU"];
    const germanCountries = ["DE", "AT", "CH", "LI", "LU"];

    if (englishCountries.includes(countryCode)) {
      return {
        mode: "detected",
        region: "US",
        locale: "en-US",
        currency: "USD"
      };
    }

    if (frenchCountries.includes(countryCode)) {
      return {
        mode: "detected",
        region: "FR",
        locale: "fr-FR",
        currency: "EUR"
      };
    }

    if (germanCountries.includes(countryCode)) {
      return {
        mode: "detected",
        region: "DE",
        locale: "de-DE",
        currency: "EUR"
      };
    }

    // 默认返回俄罗斯（品牌主要市场）
    return {
      mode: "detected",
      region: fallbackRegion.region,
      locale: fallbackRegion.locale,
      currency: fallbackRegion.currency
    };
  } catch (error) {
    // 网络错误或超时，使用默认值
    console.warn("IP detection failed, using fallback:", error);
    return {
      mode: "fallback",
      region: fallbackRegion.region,
      locale: fallbackRegion.locale,
      currency: fallbackRegion.currency
    };
  }
}
