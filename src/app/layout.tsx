import type { Metadata } from "next";
import { Inter, Cairo } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/cart-context";
import { LanguageProvider } from "@/context/language-context";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { StoreHeader } from "@/components/store/store-header";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const cairo = Cairo({ subsets: ["arabic"], variable: "--font-arabic" });

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
        className={`${inter.variable} ${cairo.variable} min-h-screen bg-background`}
      >
        <ThemeProvider>
          <LanguageProvider>
            <CartProvider>
              <StoreHeader />
              <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
            </CartProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
