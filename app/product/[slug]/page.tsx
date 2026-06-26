import { notFound } from "next/navigation";
import { products } from "@/lib/data/products";
import { ProductDetailClient } from "@/components/product/product-detail-client";
import { sortProductsByMerchOrder } from "@/lib/utils";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = products.find((entry) => entry.slug === slug);
  if (!product) {
    notFound();
  }

  const completeTheLook = sortProductsByMerchOrder(
    products.filter((entry) => product.completeTheLook.includes(entry.id))
  );

  return <ProductDetailClient product={product} completeTheLook={completeTheLook} />;
}
