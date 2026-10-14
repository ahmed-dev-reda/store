"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { Package, CheckCircle2, ArrowLeft } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { getDict } from "@/store/languageSlice";
import { getMyOrder } from "@/actions/orders";

type Order = {
  id: string;
  status: string;
  paymentMethod: string | null;
  total: number;
  customer: { id: string; name: string; email: string | null } | null;
  customerId: string | null;
  userId: string | null;
  items: {
    id: string;
    productId: string;
    productName: string | null;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }[];
  createdAt: string;
  updatedAt: string;
};

function statusStyle(status: string) {
  switch (status) {
    case "DELIVERED": return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400";
    case "PROCESSING": return "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400";
    case "PENDING": return "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400";
    case "CANCELLED": return "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400";
    default: return "bg-muted text-muted-foreground";
  }
}

export default function OrderDetailPage() {
  const lang = useAppSelector((s) => s.language.lang);
  const t = getDict(lang);
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const justPlaced = searchParams.get("placed") === "true";
  const [order, setOrder] = React.useState<Order | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    getMyOrder(params.id)
      .then((data) => {
        if (!data) throw new Error(t.failedToLoadOrders);
        setOrder(data as Order);
      })
      .catch(() => setError(t.failedToLoadOrders))
      .finally(() => setLoading(false));
  }, [params.id, t]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
        <p className="font-medium">{error ?? t.failedToLoadOrders}</p>
        <Link href="/orders" className="text-sm text-primary hover:underline">
          {t.backToOrders}
        </Link>
      </div>
    );
  }

  return (
    <section className="space-y-8">
      <Link href="/orders" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft className="size-4" />
        {t.backToOrders}
      </Link>

      {justPlaced && (
        <div className="flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950">
          <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400" />
          <div>
            <p className="font-medium text-emerald-800 dark:text-emerald-300">
              {t.orderPlacedSuccess}
            </p>
            <p className="text-sm text-emerald-700 dark:text-emerald-400">
              {t.thankYouForPurchase}
            </p>
          </div>
        </div>
      )}

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t.orderNumber} #{order.id.slice(-8).toUpperCase()}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t.placedOn}{" "}
            {new Date(order.createdAt).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {order.paymentMethod && (
            <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
              {order.paymentMethod === "visa"
                ? lang === "ar" ? "فيزا" : "Visa"
                : lang === "ar" ? "الدفع عند الاستلام" : "Cash on Delivery"}
            </span>
          )}
          <span className={`rounded-full px-3 py-1 text-sm font-medium ${statusStyle(order.status)}`}>
            {t[order.status as keyof typeof t] ?? order.status}
          </span>
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="border-b p-4">
          <h2 className="font-semibold">{t.orderItems}</h2>
        </div>
        <div className="divide-y">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-md bg-muted p-2">
                  <Package className="size-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">{item.productName ?? "Product"}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.quantity} × ${item.unitPrice.toFixed(2)}
                  </p>
                </div>
              </div>
              <span className="font-medium">${item.subtotal.toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between border-t p-4">
          <span className="font-semibold">{t.total}</span>
          <span className="font-bold text-lg">${order.total.toFixed(2)}</span>
        </div>
      </div>
    </section>
  );
}
