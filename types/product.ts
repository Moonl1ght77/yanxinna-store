export type Category = "shapewear" | "bras" | "underwear";
export type ShapewearSubcategory = "bodysuits" | "tops" | "bottoms";

export type ProductColor = {
  name: string;
  hex: string;
  image: string;
  hoverImage: string;
};

export type CompressionLevel = "Light" | "Medium" | "Firm";

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: Category;
  subcategory?: ShapewearSubcategory;
  badge?: string;
  price: number;
  compareAtPrice?: number;
  colors: ProductColor[];
  sizes: string[];
  image: string;
  hoverImage: string;
  gallery: string[];
  shortDescription: string;
  description: string;
  fabric: string;
  care: string;
  compressionLevel: CompressionLevel;
  benefits: string[];
  featured?: boolean;
  bestSeller?: boolean;
  completeTheLook: string[];
};
