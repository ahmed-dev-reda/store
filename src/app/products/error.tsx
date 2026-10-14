"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export default function ProductsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations();

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <div className="rounded-full bg-destructive/10 p-5">
        <AlertCircle className="size-10 text-destructive" />
      </div>
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">
          {t("productsLoadErrorTitle")}
        </h2>
        <p className="text-sm text-muted-foreground">
          {t("productsLoadErrorDescription")}
        </p>
      </div>
      {process.env.NODE_ENV === "development" && (
        <p className="max-w-lg rounded-md bg-muted p-3 text-xs text-muted-foreground font-mono break-all">
          {error.message}
        </p>
      )}
      <Button onClick={reset} variant="outline" className="mt-2">
        <RefreshCw className="mr-2 size-4" />
        {t("tryAgain")}
      </Button>
    </div>
  );
}
