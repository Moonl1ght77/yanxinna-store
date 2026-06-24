export type LocaleCode = "en-US" | "fr-FR" | "de-DE" | "en-GB";

export type RegionOption = {
  region: string;
  label: string;
  locale: LocaleCode;
  currency: "USD" | "EUR" | "GBP";
};
