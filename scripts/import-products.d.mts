export interface ColorInput {
  name_zh: string;
  hex: string;
}
export interface ProductRow {
  product_number: string;
  name_zh: string;
  category: string;
  subcategory: string;
  sizes: string[];
  colors: ColorInput[];
  fabric_zh: string;
  care_zh: string;
  compression_level: "Light" | "Medium" | "Firm";
  benefits_zh: string[];
  featured: boolean;
  best_seller: boolean;
  sort_order: number;
  image_dir: string;
}
export function parseCsv(text: string): string[][];
export function parseRow(record: Record<string, string>): ProductRow;
export function readProducts(csvPath: string): ProductRow[];
export function matchImages(
  files: string[],
  colors: ColorInput[]
): { colors: Array<ColorInput & { image: string; hover_image: string }>; extras: string[] };
export function listImages(dir: string): string[];
export function convertImage(src: string, dest: string): Promise<void>;
export function slugify(text: string): string;
export function main(argv: string[]): Promise<void>;
