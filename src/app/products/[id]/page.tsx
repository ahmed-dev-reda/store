"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ShoppingCart, ArrowLeft, Minus, Plus } from "lucide-react";
import { useCart } from "@/context/cart-context";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  imageUrl: string | null;
  category: { id: string; name: string } | null;
  status: string;
};

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const { addItem } = useCart();
  const [product, setProduct] = React.useState<Product | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [qty, setQty] = React.useState(1);
  const [added, setAdded] = React.useState(false);

  React.useEffect(() => {
    fetch(`/api/store/products/${params.id}`, { cache: "no-store" })
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json?.error?.message ?? "Failed to load product");
        setProduct(json.data);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load product"))
      .finally(() => setLoading(false));
  }, [params.id]);

  const handleAdd = () => {
    if (!product) return;
    addItem({ productId: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl }, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return <p className="text-muted-foreground">Loading product...</p>;
  if (error || !product)
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
        <p className="font-medium">Product not found</p>
        <Link href="/products" className="text-sm text-primary hover:underline">Back to products</Link>
      </div>
    );

  return (
    <section className="space-y-8">
      <Link href="/products" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft className="size-4" />
        Back to products
      </Link>

      <div className="grid gap-10 md:grid-cols-2">
        <div className="aspect-square rounded-lg bg-muted flex items-center justify-center">
          {product.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.imageUrl} alt={product.name} className="size-full rounded-lg object-cover" />
          ) : (
            <ShoppingCart className="size-24 text-muted-foreground" />
          )}
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground">{product.category?.name ?? "Uncategorized"}</p>
            <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
          </div>

          <p className="text-3xl font-bold">${product.price.toFixed(2)}</p>

          <p className="text-muted-foreground leading-relaxed">{product.description}</p>

          <div className="flex items-center gap-2 text-sm">
            <span className={`inline-block size-2 rounded-full ${product.quantity > 0 ? "bg-emerald-500" : "bg-red-500"}`} />
            <span className={product.quantity > 0 ? "text-emerald-600" : "text-red-600"}>
              {product.quantity > 0 ? `In Stock (${product.quantity} available)` : "Out of Stock"}
            </span>
          </div>

          {product.quantity > 0 && (
            <div className="flex items-center gap-4">
              <div className="flex items-center rounded-md border">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-2 transition-colors hover:bg-muted" aria-label="Decrease quantity">
                  <Minus className="size-4" />
                </button>
                <span className="w-10 text-center text-sm font-medium">{qty}</span>
                <button onClick={() => setQty((q) => Math.min(product.quantity, q + 1))} className="p-2 transition-colors hover:bg-muted" aria-label="Increase quantity">
                  <Plus className="size-4" />
                </button>
              </div>
              <button
                onClick={handleAdd}
                className="flex-1 rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                {added ? "Added to Cart!" : "Add to Cart"}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
