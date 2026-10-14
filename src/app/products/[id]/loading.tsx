import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetailLoading() {
  return (
    <section className="space-y-8" aria-busy="true">
      <Skeleton className="h-5 w-32" />

      <div className="grid gap-10 md:grid-cols-2">
        <Skeleton className="aspect-square rounded-lg" />

        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-9 w-3/4" />
          </div>

          <Skeleton className="h-9 w-32" />

          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          <Skeleton className="h-5 w-40" />

          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-28" />
            <Skeleton className="h-10 flex-1" />
          </div>
        </div>
      </div>
    </section>
  );
}
