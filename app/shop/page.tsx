import { ShopClient } from "@/components/shop/shop-client";

export default async function ShopPage({
  searchParams
}: {
  searchParams: Promise<{
    category?: string;
    subcategory?: string;
    sort?: string;
  }>;
}) {
  const params = await searchParams;

  return (
    <ShopClient
      initialCategory={params.category}
      initialSubcategory={params.subcategory}
      initialSort={params.sort}
    />
  );
}
