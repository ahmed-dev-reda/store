"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { Package, CheckCircle2, ArrowLeft } from "lucide-react";

type Order = {
  id: string;
  status: string;
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
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const justPlaced = searchParams.get("placed") === "true";
  const [order, setOrder] = React.useState<Order | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetch(`/api/sales/${params.id}`, { cache: "no-store" })
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json?.error?.message ?? "Failed to load order");
        setOrder(json.data);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load order"))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) return <p className="text-muted-foreground">Loading order...</p>;
  if (error || !order)
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
        <p className="font-medium">Order not found</p>
        <Link href="/orders" className="text-sm text-primary hover:underline">Back to orders</Link>
      </div>
    );

  return (
    <section className="space-y-8">
      <Link href="/orders" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft className="size-4" />
        Back to orders
      </Link>

      {justPlaced && (
        <div className="flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950">
          <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400" />
          <div>
            <p className="font-medium text-emerald-800 dark:text-emerald-300">Order placed successfully!</p>
            <p className="text-sm text-emerald-700 dark:text-emerald-400">Thank you for your purchase.</p>
          </div>
        </div>
      )}

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Order #{order.id.slice(-8).toUpperCase()}</h1>
          <p className="text-muted-foreground mt-1">
            Placed on{" "}
            {new Date(order.createdAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
        <span className={`rounded-full px-3 py-1 text-sm font-medium ${statusStyle(order.status)}`}>
          {order.status}
        </span>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="border-b p-4">
          <h2 className="font-semibold">Items</h2>
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
                    {item.quantity} x ${item.unitPrice.toFixed(2)}
                  </p>
                </div>
              </div>
              <span className="font-medium">${item.subtotal.toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between border-t p-4">
          <span className="font-semibold">Total</span>
          <span className="font-bold text-lg">${order.total.toFixed(2)}</span>
        </div>
      </div>
    </section>
  );
}
