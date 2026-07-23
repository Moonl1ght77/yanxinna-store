import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { ProductDetailClient } from "@/components/product/product-detail-client";
import { sortProductsByMerchOrder } from "@/lib/utils";
import {
  getProductBySlug,
  getProducts
} from "@/lib/wordpress/repository";
import { localizeProduct } from "@/lib/wordpress/localize";
import { getMockRegionByCode } from "@/lib/region";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const productRecord = await getProductBySlug(slug);

  if (!productRecord) {
    notFound();
  }

  const region = getMockRegionByCode(
    (await cookies()).get("yanxinna-region")?.value
  );
  const product = localizeProduct(productRecord, region.locale);

  return {
    title: product.seoTitle,
    description: product.seoDescription
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const products = await getProducts({ perPage: 100 });
  const relatedIds = new Set(product.completeTheLook);
  const completeTheLook = sortProductsByMerchOrder(
    products.filter(
      (entry) =>
        relatedIds.has(entry.id) || relatedIds.has(entry.productNumber)
    )
  );

  return <ProductDetailClient product={product} completeTheLook={completeTheLook} />;
}
