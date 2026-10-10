"use client";

import * as React from "react";
import Link from "next/link";
import { ShoppingCart, Search } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useLanguage } from "@/context/language-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

export default function ProductsPage() {
  const { t } = useLanguage();
  const { addItem } = useCart();
  const [products, setProducts] = React.useState<Product[]>([]);
  const [categories, setCategories] = React.useState<{ id: string; name: string }[]>([]);
  const [search, setSearch] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("");
  const [loading, setLoading] = React.useState(true);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (selectedCategory) params.set("category", selectedCategory);
      params.set("limit", "100");
      const res = await fetch(`/api/store/products?${params}`, { cache: "no-store" });
      const json = await res.json();
      if (json?.success) setProducts(json.data);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [search, selectedCategory]);

  React.useEffect(() => {
    const timeout = setTimeout(load, 300);
    return () => clearTimeout(timeout);
  }, [load]);

  React.useEffect(() => {
    fetch("/api/store/categories", { cache: "no-store" })
      .then((r) => r.json())
      .then((json) => {
        if (json?.success) setCategories(json.data);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t.products}</h1>
        <p className="text-muted-foreground mt-1">{t.browseCatalog}</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={selectedCategory} onValueChange={(v) => setSelectedCategory(v ?? "")}>
          <SelectTrigger className="sm:w-[200px]">
            <SelectValue placeholder={t.allCategories} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">{t.allCategories}</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.name}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <p className="text-muted-foreground">{t.loading}</p>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-20 text-center">
          <div className="rounded-full bg-muted p-4">
            <Search className="size-8 text-muted-foreground" />
          </div>
          <p className="font-medium">{t.noProducts}</p>
          <p className="text-sm text-muted-foreground">{t.noProductsHint}</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <Card key={product.id} className="group overflow-hidden">
              <Link href={`/products/${product.id}`}>
                <div className="relative aspect-square bg-muted">
                  {product.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="size-full object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center">
                      <ShoppingCart className="size-12 text-muted-foreground" />
                    </div>
                  )}
                  {product.quantity <= 0 && (
                    <Badge variant="destructive" className="absolute right-2 top-2">
                      {t.outOfStock}
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">{product.category?.name ?? "—"}</p>
                  <h3 className="mt-1 font-semibold tracking-tight group-hover:underline">
                    {product.name}
                  </h3>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
                    {product.quantity > 0 && (
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          addItem({
                            productId: product.id,
                            name: product.name,
                            price: product.price,
                            imageUrl: product.imageUrl,
                          });
                        }}
                      >
                        <ShoppingCart className="mr-1.5 size-4" />
                        {t.addToCart}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
