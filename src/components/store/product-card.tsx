"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useFormatter, useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types/product";
import { getImageUrl } from "@/lib/image-url";

export function ProductCard({ product }: { product: Product }) {
  const t = useTranslations();
  const format = useFormatter();
  const { addItem } = useCart();

  return (
    <Card className="group overflow-hidden">
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square bg-muted">
          {product.imageUrl ? (
            <Image
              src={getImageUrl(product.imageUrl)}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 25vw"
              className="size-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex size-full items-center justify-center">
              <ShoppingCart className="size-12 text-muted-foreground" />
            </div>
          )}
          {product.quantity <= 0 && (
            <Badge variant="destructive" className="absolute right-2 top-2">
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
            <span className="text-lg font-bold">{format.number(product.price, { style: "currency", currency: "USD" })}</span>
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
                {t("addToCart")}
              </Button>
            )}
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
