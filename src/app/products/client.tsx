"use client";

import * as React from "react";
import Link from "next/link";
import { ShoppingCart, Search } from "lucide-react";
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

import { useAppDispatch } from "@/store/hooks";
import { addItem } from "@/store/cartSlice";
import { useFormatter, useTranslations } from "next-intl";
import Image from "next/image";
import { getImageUrl } from "@/lib/image-url";

type Category = { id: string; name: string };
type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  imageUrl: string | null;
  category: Category | null;
  status: string;
};

export default function ClientProductsPage({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const dispatch = useAppDispatch();
  const t = useTranslations();
  const format = useFormatter();
  const [search, setSearch] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("");

  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("products")}</h1>
        <p className="text-muted-foreground mt-1">{t("browseCatalog")}</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={selectedCategory}
          onValueChange={(v) => setSelectedCategory(v ?? "")}
        >
          <SelectTrigger className="sm:w-[200px]">
            <SelectValue placeholder={t("allCategories")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">{t("allCategories")}</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.name}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <Card
            key={product.id}
            className="group overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1"
          >
            <Link href={`/products/${product.id}`}>
              <div className="relative aspect-square bg-muted overflow-hidden">
                {product.imageUrl ? (
                  <Image
                    src={getImageUrl(product.imageUrl)}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="size-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center">
                    <ShoppingCart className="size-12 text-muted-foreground" />
                  </div>
                )}
                {product.quantity <= 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute right-2 top-2"
                  >
                    {t("outOfStock")}
                  </Badge>
                )}
              </div>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">
                  {product.category?.name ?? "—"}
                </p>
                <h3 className="mt-1 font-semibold tracking-tight group-hover:underline">
                  {product.name}
                </h3>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-lg font-bold">
                    {format.number(product.price, {
                      style: "currency",
                      currency: "USD",
                    })}
                  </span>
                  {product.quantity > 0 && (
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(
                          addItem({
                            productId: product.id,
                            name: product.name,
                            price: product.price,
                            imageUrl: product.imageUrl,
                          }),
                        );
                      }}
                    >
                      <ShoppingCart className="mr-1.5 size-4" />
                      {t("addToCart")}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </section>
  );
}
