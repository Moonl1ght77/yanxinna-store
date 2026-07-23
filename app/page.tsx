import { connection } from "next/server";
import { HomePage } from "@/components/home/home-page";
import { getProducts } from "@/lib/wordpress/repository";

export default async function Page() {
  await connection();
  const products = await getProducts({ perPage: 12 });

  return <HomePage products={products} />;
}
