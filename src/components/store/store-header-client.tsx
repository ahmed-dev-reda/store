"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, User, LogOut, Package, Languages } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setLang } from "@/store/languageSlice";
import { authClient } from "@/lib/auth-client";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

type StoreSession = {
  user: {
    id: string;
  };
} | null;

export function StoreHeaderClient({ session }: { session: StoreSession }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const t = useTranslations();
  const totalItems = useAppSelector((s) =>
    s.cart.items.reduce((sum, i) => sum + i.quantity, 0),
  );
  const lang = useAppSelector((s) => s.language.lang);

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
    router.refresh();
  };

  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsHydrated(true);
  }, []);
  if (!isHydrated) return null;
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold tracking-tight">
          {t("store")}
        </Link>

        <nav className="flex items-center gap-4">
          <Link
            href="/products"
            className="hidden sm:block text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {t("products")}
          </Link>

          {session?.user ? (
            <>
              <Link
                href="/orders"
                className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <Package className="size-4" />
                {t("myOrders")}
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="gap-1.5 text-sm font-medium text-muted-foreground"
              >
                <LogOut className="size-4" />
                <span className="hidden sm:inline">
                  {t("logout")}
                </span>
              </Button>
            </>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <User className="size-4" />
              <span className="hidden sm:inline">
                {t("login")}
              </span>
            </Link>
          )}

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={() => dispatch(setLang(lang === "en" ? "ar" : "en"))}
              aria-label={t("toggleLanguage")}
            >
              <Languages className="size-4" />
            </Button>
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="size-8 relative">
              <Link
                href="/cart"
                aria-label={t("cart")}
                className="absolute inset-0 flex items-center justify-center"
              >
                <ShoppingCart className="size-5" />
                {totalItems > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-semibold text-primary-foreground">
                    {totalItems}
                  </span>
                )}
              </Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
