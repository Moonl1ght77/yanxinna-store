import type {
  LocalizedValues,
  ProductAttachmentRecord,
  ProductColorRecord,
  ProductParameterRecord,
  ProductRecord,
  ProductTranslation
} from "@/types/product";
import type { LocaleCode } from "@/types/locale";
import { wordpressProductSchema } from "@/lib/wordpress/schemas";

const locales: LocaleCode[] = ["ru-RU", "en-US", "en-GB", "fr-FR", "de-DE"];

function mapLocalizedValues(values: Record<LocaleCode, string>): LocalizedValues {
  return Object.fromEntries(locales.map((locale) => [locale, values[locale]])) as LocalizedValues;
}

function mapTranslations(
  translations: Record<
    LocaleCode,
    {
      name: string;
      short_description: string;
      description: string;
      badge: string;
      fabric: string;
      care: string;
      benefits: string[];
      seo_title: string;
      seo_description: string;
    }
  >
): Record<LocaleCode, ProductTranslation> {
  return Object.fromEntries(
    locales.map((locale) => {
      const translation = translations[locale];
      return [
        locale,
        {
          name: translation.name,
          shortDescription: translation.short_description,
          description: translation.description,
          badge: translation.badge || undefined,
          fabric: translation.fabric,
          care: translation.care,
          benefits: translation.benefits,
          seoTitle: translation.seo_title,
          seoDescription: translation.seo_description
        }
      ];
    })
  ) as Record<LocaleCode, ProductTranslation>;
}

export function mapWordPressProduct(input: unknown): ProductRecord {
  const parsed = wordpressProductSchema.parse(input);

  const colors: ProductColorRecord[] = parsed.colors.map((color) => ({
    names: mapLocalizedValues(color.names),
    hex: color.hex,
    image: color.image.url,
    hoverImage: color.hover_image.url
  }));
  const parameters: ProductParameterRecord[] = parsed.parameters.map((parameter) => ({
    labels: mapLocalizedValues(parameter.labels),
    values: mapLocalizedValues(parameter.values)
  }));
  const attachments: ProductAttachmentRecord[] = parsed.attachments.map((attachment) => ({
    labels: mapLocalizedValues(attachment.labels),
    url: attachment.url,
    mimeType: attachment.mime_type
  }));

  return {
    id: String(parsed.id),
    slug: parsed.slug,
    productNumber: parsed.product_number,
    category: parsed.category.slug,
    subcategory: parsed.subcategory?.slug,
    image: parsed.main_image.url,
    hoverImage: parsed.hover_image?.url,
    gallery: parsed.gallery.map((image) => image.url),
    colors,
    sizes: parsed.sizes.map((size) => size.value),
    parameters,
    attachments,
    compressionLevel: parsed.compression_level ?? undefined,
    featured: parsed.featured,
    bestSeller: parsed.best_seller,
    sortOrder: parsed.sort_order,
    completeTheLook: parsed.complete_the_look,
    translations: mapTranslations(parsed.translations)
  };
}
