import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter, Cairo } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/components/providers/store-provider";
import { I18nProvider } from "@/components/providers/i18n-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { StoreHeader } from "@/components/store/store-header";

const inter = Inter({ subsets: ["latin"] });
const cairo = Cairo({ subsets: ["arabic"] });

export const metadata: Metadata = {
  title: "Store",
  description: "Online store",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} ${cairo.className} min-h-screen bg-background`}
      >
        <ThemeProvider>
          <StoreProvider>
            <I18nProvider>
              <Suspense
                fallback={<div className="h-16 border-b" aria-hidden />}
              >
                <StoreHeader />
              </Suspense>
              <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
            </I18nProvider>
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
