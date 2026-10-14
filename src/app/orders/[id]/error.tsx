"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { getDict } from "@/store/languageSlice";
import { Button } from "@/components/ui/button";

export default function OrderDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const lang = useAppSelector((s) => s.language.lang);
  const t = getDict(lang);
  // Force re-render when language changes so translated messages update
  void t;

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <div className="rounded-full bg-destructive/10 p-5">
        <AlertCircle className="size-10 text-destructive" />
      </div>
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">
          {lang === "ar" ? "فشل تحميل الطلب" : "Failed to load order"}
        </h2>
        <p className="text-sm text-muted-foreground">
          {lang === "ar"
            ? "يرجى المحاولة مرة أخرى. إذا استمرت المشكلة، اتصل بالدعم."
            : "Please try again. If the problem persists, contact support."}
        </p>
      </div>
      {process.env.NODE_ENV === "development" && (
        <p className="max-w-lg rounded-md bg-muted p-3 text-xs text-muted-foreground font-mono break-all">
          {error.message}
        </p>
      )}
      <Button onClick={reset} variant="outline" className="mt-2">
        <RefreshCw className="mr-2 size-4" />
        {lang === "ar" ? "إعادة المحاولة" : "Try again"}
      </Button>
    </div>
  );
}
