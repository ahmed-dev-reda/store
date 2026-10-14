"use client";

import * as React from "react";
import Link from "next/link";
import { Package, ChevronRight, LogIn } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useAppSelector } from "@/store/hooks";
import { getDict } from "@/store/languageSlice";
import { getMyOrders } from "@/actions/orders";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

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

function OrdersSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Skeleton className="size-10 rounded-md" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-4 w-16" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function OrdersPage() {
  const lang = useAppSelector((s) => s.language.lang);
  const t = getDict(lang);
  const { data: session, isPending } = authClient.useSession();
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [dataLoading, setDataLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isPending || !session) return;
    let cancelled = false;
    getMyOrders()
      .then((data) => {
        if (!cancelled) setOrders(data as Order[]);
      })
      .catch(() => {
        if (!cancelled) setError(t.failedToLoadOrders);
      })
      .finally(() => {
        if (!cancelled) setDataLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isPending, session, t]);

  if (isPending) {
    return (
      <section className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t.myOrders}</h1>
          <p className="text-muted-foreground mt-1">{t.trackOrders}</p>
        </div>
        <OrdersSkeleton />
      </section>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <div className="rounded-full bg-muted p-5">
          <LogIn className="size-10 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold">{t.pleaseSignIn}</h2>
        <p className="text-muted-foreground">{t.signInToViewOrders}</p>
        <Link
          href="/login"
          className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          {t.signIn}
        </Link>
      </div>
    );
  }

  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t.myOrders}</h1>
        <p className="text-muted-foreground mt-1">{t.trackOrders}</p>
      </div>

      {error ? (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <div className="rounded-full bg-muted p-5">
            <Package className="size-10 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold">{t.noOrdersYet}</h2>
          <p className="text-muted-foreground">{t.ordersEmptyHint}</p>
          <Link
            href="/products"
            className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            {t.startShopping}
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="block rounded-lg border bg-card p-4 transition-all hover:shadow-md hover:border-primary/50"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="rounded-md bg-muted p-2.5">
                    <Package className="size-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {t.orderNumber} #{order.id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString(
                        lang === "ar" ? "ar-EG" : "en-US",
                        {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        },
                      )}
                      {" · "}
                      {order.items.reduce((s, i) => s + i.quantity, 0)}{" "}
                      {t.items}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant={
                      order.status === "DELIVERED"
                        ? "default"
                        : order.status === "CANCELLED"
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {t[order.status as keyof typeof t] ?? order.status}
                  </Badge>
                  <span className="font-semibold">
                    {order.total.toFixed(2)} EGP
                  </span>
                  <ChevronRight className="size-4 text-muted-foreground" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
