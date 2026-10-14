import { getStoreProducts, getStoreCategories } from "@/actions/products";
import ClientProductsPage from "./client";

export default async function ProductsPage() {
  const products = await getStoreProducts();
  const categories = await getStoreCategories();
  return <ClientProductsPage categories={categories} products={products} />;
}
