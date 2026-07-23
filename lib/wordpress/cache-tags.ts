export const productListTag = "products";
export const productCategoriesTag = "categories";

export function productDetailTag(slug: string) {
  return `product:${slug}`;
}
