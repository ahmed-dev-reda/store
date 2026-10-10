"use client";

import * as React from "react";
import Link from "next/link";
import { Package, ChevronRight } from "lucide-react";
import { authClient } from "@/lib/auth-client";

type Order = {
  id: string;
  status: string;
  total: number;
  customer: unknown;
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

export default function OrdersPage() {
  const { data: session, isPending } = authClient.useSession();
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isPending) return;
    if (!session) return;
    fetch("/api/sales?limit=100", { cache: "no-store" })
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json?.error?.message ?? "Failed to load orders");
        const all = json.data as Order[];
        // Customers see only their own orders
        setOrders(all.filter((o) => o.userId === session.user.id));
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load orders"))
      .finally(() => setLoading(false));
  }, [isPending, session]);

  if (isPending) return <p className="text-muted-foreground">Loading...</p>;

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <div className="rounded-full bg-muted p-5">
          <Package className="size-10 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold">Please sign in</h2>
        <p className="text-muted-foreground">You need an account to view your orders.</p>
        <Link href="/login" className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
        <p className="text-muted-foreground mt-1">Track your order status and history</p>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading orders...</p>
      ) : error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <div className="rounded-full bg-muted p-5">
            <Package className="size-10 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold">No orders yet</h2>
          <p className="text-muted-foreground">When you place an order, it will show up here.</p>
          <Link href="/products" className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="flex items-center justify-between rounded-lg border bg-card p-4 transition-shadow hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="rounded-md bg-muted p-2.5">
                  <Package className="size-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">Order #{order.id.slice(-8).toUpperCase()}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                    {" · "}
                    {order.items.reduce((s, i) => s + i.quantity, 0)} items
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyle(order.status)}`}>
                  {order.status}
                </span>
                <span className="font-semibold">${order.total.toFixed(2)}</span>
                <ChevronRight className="size-4 text-muted-foreground" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
