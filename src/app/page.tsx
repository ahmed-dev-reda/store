import Link from "next/link";
import {
  ShoppingCart,
  ArrowRight,
  Truck,
  ShieldCheck,
  RefreshCcw,
} from "lucide-react";

async function getFeaturedProducts() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL ?? "https://admin-devtrend.vercel.app"}/api/store/products?limit=4&status=In Stock`,
      { cache: "no-store" },
    );
    const json = await res.json();
    if (!json.success) return [];
    return json.data as {
      id: string;
      name: string;
      description: string;
      price: number;
      quantity: number;
      imageUrl: string | null;
      category: { id: string; name: string } | null;
      status: string;
    }[];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const products = await getFeaturedProducts();

  return (
    <section className="space-y-16">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl border bg-card">
        <div className="px-8 py-16 sm:px-16 sm:py-24 space-y-6">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Welcome to our Store
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            Discover amazing products at great prices. Shop with confidence with
            our secure checkout and fast shipping.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Shop Now
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-md border px-6 py-3 text-sm font-medium transition-colors hover:bg-muted"
            >
              Browse Catalog
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            icon: Truck,
            title: "Fast Shipping",
            desc: "Free delivery on all orders",
          },
          {
            icon: ShieldCheck,
            title: "Secure Payment",
            desc: "Your data is always protected",
          },
          {
            icon: RefreshCcw,
            title: "Easy Returns",
            desc: "30-day return policy",
          },
        ].map((f) => (
          <div
            key={f.title}
            className="rounded-lg border bg-card p-6 space-y-3"
          >
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
          <h2 className="text-2xl font-bold tracking-tight">
            Featured Products
          </h2>
          <Link
            href="/products"
            className="text-sm text-primary hover:underline"
          >
            View all
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-16 text-center">
            <div className="rounded-full bg-muted p-4">
              <ShoppingCart className="size-8 text-muted-foreground" />
            </div>
            <p className="font-medium">No products available yet</p>
            <p className="text-sm text-muted-foreground">
              Check back soon for new arrivals.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="group rounded-lg border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-4 aspect-square rounded-md bg-muted flex items-center justify-center">
                  {product.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="size-full rounded-md object-cover"
                    />
                  ) : (
                    <ShoppingCart className="size-12 text-muted-foreground" />
                  )}
                </div>
                <h3 className="font-semibold tracking-tight group-hover:underline">
                  {product.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {product.category?.name ?? "Uncategorized"}
                </p>
                <p className="mt-2 text-lg font-bold">
                  ${product.price.toFixed(2)}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
