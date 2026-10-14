"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { removeItem, updateQuantity } from "@/store/cartSlice";
import { getImageUrl } from "@/lib/image-url";
import { useTranslations, useFormatter } from "next-intl";

export default function CartPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.cart.items);
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const t = useTranslations();
  const format = useFormatter();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <div className="rounded-full bg-muted p-5">
          <ShoppingBag className="size-10 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold">{t("emptyCart")}</h2>
        <p className="text-muted-foreground">{t("emptyCartHint")}</p>
        <Link
          href="/products"
          className="mt-2 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          {t("browseProducts")}
          <ArrowRight className="size-4" />
        </Link>
      </div>
    );
  }

  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("shoppingCart")}</h1>
        <p className="text-muted-foreground mt-1">{t(totalItems === 1 ? "itemInCart" : "itemsInCart", { count: totalItems })}</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.productId} className="flex gap-4 rounded-lg border bg-card p-4">
              <div className="relative size-24 shrink-0 rounded-md bg-muted flex items-center justify-center">
                {item.imageUrl ? (
                  <Image
                    src={getImageUrl(item.imageUrl)}
                    alt={item.name}
                    fill
                    sizes="96px"
                    className="size-full rounded-md object-cover"
                  />
                ) : (
                  <ShoppingBag className="size-8 text-muted-foreground" />
                )}
              </div>
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-4">
                  <Link href={`/products/${item.productId}`} className="font-medium hover:underline">
                    {item.name}
                  </Link>
                  <button onClick={() => dispatch(removeItem(item.productId))} className="text-muted-foreground transition-colors hover:text-destructive" aria-label={t("removeItem")}>
                    <Trash2 className="size-4" />
                  </button>
                </div>
                <p className="text-sm text-muted-foreground">{format.number(item.price, { style: "currency", currency: "EGP" })} {t("each")}</p>
                <div className="mt-auto flex items-center justify-between pt-3">
                  <div className="flex items-center rounded-md border">
                    <button onClick={() => dispatch(updateQuantity({ productId: item.productId, quantity: item.quantity - 1 }))} className="p-1.5 transition-colors hover:bg-muted" aria-label={t("decreaseQuantity")}>
                      <Minus className="size-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button onClick={() => dispatch(updateQuantity({ productId: item.productId, quantity: item.quantity + 1 }))} className="p-1.5 transition-colors hover:bg-muted" aria-label={t("increaseQuantity")}>
                      <Plus className="size-3.5" />
                    </button>
                  </div>
                  <span className="font-semibold">{format.number(item.price * item.quantity, { style: "currency", currency: "EGP" })}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="h-fit rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold">{t("orderSummary")}</h2>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>{t("subtotal")}</span>
              <span>{format.number(totalPrice, { style: "currency", currency: "EGP" })}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>{t("shipping")}</span>
              <span>{t("free")}</span>
            </div>
            <div className="border-t pt-2 flex justify-between text-base font-semibold">
              <span>{t("total")}</span>
              <span>{format.number(totalPrice, { style: "currency", currency: "EGP" })}</span>
            </div>
          </div>
          <button
            onClick={() => router.push("/checkout")}
            className="mt-6 w-full rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            {t("proceedToCheckout")}
          </button>
          <Link href="/products" className="mt-3 block text-center text-sm text-muted-foreground hover:text-foreground">
            {t("continueShopping")}
          </Link>
        </div>
      </div>
    </section>
  );
}
