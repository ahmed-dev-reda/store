"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from "next-intl";

export default function LoginLoading() {
  const t = useTranslations();
  return (
    <div
      className="flex min-h-[70vh] items-center justify-center"
      aria-busy="true"
      role="status"
    >
      <span className="sr-only">{t("loadingLogin")}</span>
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center space-y-2">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-10 w-full" />
          <Skeleton className="mx-auto h-4 w-48" />
        </CardContent>
      </Card>
    </div>
  );
}
