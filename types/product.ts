import type { LocaleCode } from "@/types/locale";

export type Category = "shapewear" | "bras" | "underwear";
export type ShapewearSubcategory = "bodysuits" | "tops" | "bottoms";
export type CompressionLevel = "Light" | "Medium" | "Firm";

export type ProductImage = {
  id: number;
  url: string;
  alt: string;
};

export type LocalizedValues = Record<LocaleCode, string>;

export type ProductColorRecord = {
  names: LocalizedValues;
  hex: string;
  image: string;
  hoverImage: string;
};

export type ProductColor = {
  name: string;
  hex: string;
  image: string;
  hoverImage: string;
};

export type ProductParameterRecord = {
  labels: LocalizedValues;
  values: LocalizedValues;
};

export type ProductParameter = {
  label: string;
  value: string;
};

export type ProductAttachmentRecord = {
  labels: LocalizedValues;
  url: string;
  mimeType: string;
};

export type ProductAttachment = {
  label: string;
  url: string;
  mimeType: string;
};

export type ProductTranslation = {
  name: string;
  shortDescription: string;
  description: string;
  badge?: string;
  fabric: string;
  care: string;
  benefits: string[];
  seoTitle: string;
  seoDescription: string;
};

type ProductShared = {
  id: string;
  slug: string;
  productNumber: string;
  category: string;
  subcategory?: string;
  image: string;
  hoverImage?: string;
  gallery: string[];
  sizes: string[];
  compressionLevel?: CompressionLevel;
  featured: boolean;
  bestSeller: boolean;
  sortOrder: number;
  completeTheLook: string[];
};

export type ProductRecord = ProductShared & {
  colors: ProductColorRecord[];
  parameters: ProductParameterRecord[];
  attachments: ProductAttachmentRecord[];
  translations: Record<LocaleCode, ProductTranslation>;
};

export type Product = ProductShared &
  ProductTranslation & {
    colors: ProductColor[];
    parameters: ProductParameter[];
    attachments: ProductAttachment[];
  };

export type ProductCategory = {
  id: number;
  slug: string;
  name: string;
  parent: number;
};

export type ProductQuery = {
  category?: string;
  subcategory?: string;
  featured?: boolean;
  bestSeller?: boolean;
  search?: string;
  page?: number;
  perPage?: number;
};

export type ProductSearchItem = {
  id: string;
  slug: string;
  category: string;
  names: LocalizedValues;
};
