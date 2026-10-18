"use client";

import { Product } from "@/types/product";
import { ArrowLeft, Minus, Plus, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { addItem } from "@/store/cartSlice";
import { useFormatter, useTranslations } from "next-intl";
import { getImageUrl } from "@/lib/image-url";

export default function Client({ product }: { product: Product }) {
  const dispatch = useAppDispatch();
  const t = useTranslations();
  const format = useFormatter();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const handleAdd = () => {
    if (!product) return;
    dispatch(
      addItem(
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
        },
        qty,
      ),
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <section className="space-y-8">
      <Link
        href="/products"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        {t("backToProducts")}
      </Link>

      <div className="grid gap-10 md:grid-cols-2">
        <div className="relative aspect-square rounded-lg bg-muted flex items-center justify-center">
          {product.imageUrl ? (
            <Image
              src={getImageUrl(product.imageUrl)}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              unoptimized
              className="size-full rounded-lg object-cover"
            />
          ) : (
            <ShoppingCart className="size-24 text-muted-foreground" />
          )}
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground">
              {product.category?.name ?? t("uncategorized")}
            </p>
            <h1 className="text-3xl font-bold tracking-tight">
              {product.name}
            </h1>
          </div>

          <p className="text-3xl font-bold">{format.number(product.price, { style: "currency", currency: "EGP" })}</p>

          <p className="text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          <div className="flex items-center gap-2 text-sm">
            <span
              className={`inline-block size-2 rounded-full ${product.quantity > 0 ? "bg-emerald-500" : "bg-red-500"}`}
            />
            <span
              className={
                product.quantity > 0 ? "text-emerald-600" : "text-red-600"
              }
            >
              {product.quantity > 0
                ? `${t("inStock")} (${product.quantity} ${t("available")})`
                : t("outOfStock")}
            </span>
          </div>

          {product.quantity > 0 && (
            <div className="flex items-center gap-4">
              <div className="flex items-center rounded-md border">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="p-2 transition-colors hover:bg-muted"
                  aria-label={t("decreaseQuantity")}
                >
                  <Minus className="size-4" />
                </button>
                <span className="w-10 text-center text-sm font-medium">
                  {qty}
                </span>
                <button
                  onClick={() =>
                    setQty((q) => Math.min(product.quantity, q + 1))
                  }
                  className="p-2 transition-colors hover:bg-muted"
                  aria-label={t("increaseQuantity")}
                >
                  <Plus className="size-4" />
                </button>
              </div>
              <button
                onClick={handleAdd}
                className="flex-1 rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                {added ? t("addedToCart") : t("addToCart")}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
