export type LocaleCode = "ru-RU" | "en-US" | "fr-FR" | "de-DE" | "en-GB";

export type RegionOption = {
  region: string;
  label: string;
  locale: LocaleCode;
  currency: "RUB" | "USD" | "EUR" | "GBP";
};
