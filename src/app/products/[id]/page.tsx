import { getStoreProduct } from "@/actions/products";
import Client from "./client";
import { notFound } from "next/navigation";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getStoreProduct(id);
  if (!product) notFound();
  return <Client product={product} />;
}
