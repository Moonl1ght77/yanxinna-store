import type { LocaleCode } from "@/types/locale";
import type { Product, ProductRecord } from "@/types/product";

export function localizeProduct(record: ProductRecord, locale: LocaleCode): Product {
  const translation = record.translations[locale] ?? record.translations["ru-RU"];
  const { translations, colors, parameters, attachments, ...shared } = record;

  return {
    ...shared,
    ...translation,
    colors: colors.map((color) => ({
      name: color.names[locale] ?? color.names["ru-RU"],
      hex: color.hex,
      image: color.image,
      hoverImage: color.hoverImage
    })),
    parameters: parameters.map((parameter) => ({
      label: parameter.labels[locale] ?? parameter.labels["ru-RU"],
      value: parameter.values[locale] ?? parameter.values["ru-RU"]
    })),
    attachments: attachments.map((attachment) => ({
      label: attachment.labels[locale] ?? attachment.labels["ru-RU"],
      url: attachment.url,
      mimeType: attachment.mimeType
    }))
  };
}
