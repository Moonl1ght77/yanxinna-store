import { CheckoutSuccessClient } from "@/components/cart/checkout-success-client";

export default async function CheckoutSuccessPage({
  searchParams
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const params = await searchParams;
  return <CheckoutSuccessClient order={params.order ?? "AB-1001"} />;
}
