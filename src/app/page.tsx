"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, ArrowRight, Truck, ShieldCheck, RefreshCcw } from "lucide-react";
import { AddToCartButton } from "@/components/store/add-to-cart-button";
import { useFormatter, useTranslations } from "next-intl";
import { Skeleton } from "@/components/ui/skeleton";
import { getStoreProducts } from "@/actions/products";
import { getImageUrl } from "@/lib/image-url";

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

function FeaturedCardSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm space-y-3">
      <Skeleton className="aspect-square rounded-md" />
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-6 w-16" />
    </div>
  );
}

export default function HomePage() {
  const t = useTranslations();
  const format = useFormatter();
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    getStoreProducts({ limit: 4 })
      .then(setProducts)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="space-y-16">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl border bg-card">
        <div className="px-8 py-16 sm:px-16 sm:py-24 space-y-6">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            {t("welcome")}
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            {t("welcomeDesc")}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              {t("shopNow")}
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-md border px-6 py-3 text-sm font-medium transition-colors hover:bg-muted"
            >
              {t("browseCatalog")}
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { icon: Truck, title: t("fastShipping"), desc: t("fastShippingDesc") },
          { icon: ShieldCheck, title: t("securePayment"), desc: t("securePaymentDesc") },
          { icon: RefreshCcw, title: t("easyReturns"), desc: t("easyReturnsDesc") },
        ].map((f) => (
          <div key={f.title} className="rounded-lg border bg-card p-6 space-y-3">
            <div className="rounded-md bg-muted p-2.5 w-fit">
              <f.icon className="size-5 text-muted-foreground" />
            </div>
            <h3 className="font-semibold">{f.title}</h3>
            <p className="text-sm text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Featured Products */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">{t("featuredProducts")}</h2>
          <Link href="/products" className="text-sm text-primary hover:underline">
            {t("viewAll")}
          </Link>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <FeaturedCardSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-16 text-center">
            <div className="rounded-full bg-muted p-4">
              <ShoppingCart className="size-8 text-muted-foreground" />
            </div>
            <p className="font-medium">{t("noProductsAvailable")}</p>
            <p className="text-sm text-muted-foreground">{t("noProductsAvailableHint")}</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="group rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1"
              >
                <div className="relative mb-4 aspect-square rounded-md bg-muted overflow-hidden">
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
                </div>
                <p className="text-xs text-muted-foreground">
                  {product.category?.name ?? "—"}
                </p>
                <h3 className="mt-1 font-semibold tracking-tight group-hover:underline">
                  {product.name}
                </h3>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-lg font-bold">
                    {format.number(product.price, { style: "currency", currency: "EGP" })}
                  </span>
                  {product.quantity > 0 && (
                    <AddToCartButton
                      product={{
                        productId: product.id,
                        name: product.name,
                        price: product.price,
                        imageUrl: product.imageUrl,
                      }}
                    />
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
