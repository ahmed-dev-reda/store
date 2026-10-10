"use client";

import * as React from "react";

export type Lang = "en" | "ar";

const dict = {
  en: {
    store: "Store",
    products: "Products",
    myOrders: "My Orders",
    login: "Login",
    logout: "Logout",
    cart: "Cart",
    searchPlaceholder: "Search products...",
    allCategories: "All Categories",
    loading: "Loading products...",
    noProducts: "No products found",
    noProductsHint: "Try a different search or category",
    addToCart: "Add to Cart",
    outOfStock: "Out of Stock",
    inStock: "In Stock",
    price: "Price",
    category: "Category",
    shopNow: "Shop Now",
    browseCatalog: "Browse Catalog",
    featuredProducts: "Featured Products",
    viewAll: "View all",
    noProductsAvailable: "No products available yet",
    noProductsAvailableHint: "Check back soon for new arrivals.",
    welcome: "Welcome to our Store",
    welcomeDesc:
      "Discover amazing products at great prices. Shop with confidence with our secure checkout and fast shipping.",
    fastShipping: "Fast Shipping",
    fastShippingDesc: "Free delivery on all orders",
    securePayment: "Secure Payment",
    securePaymentDesc: "Your data is always protected",
    easyReturns: "Easy Returns",
    easyReturnsDesc: "30-day return policy",
    items: "items",
    emptyCart: "Your cart is empty",
    emptyCartHint: "Looks like you haven't added anything yet.",
    browseProducts: "Browse Products",
  },
  ar: {
    store: "المتجر",
    products: "المنتجات",
    myOrders: "طلباتي",
    login: "تسجيل الدخول",
    logout: "تسجيل الخروج",
    cart: "السلة",
    searchPlaceholder: "ابحث عن المنتجات...",
    allCategories: "كل التصنيفات",
    loading: "جاري تحميل المنتجات...",
    noProducts: "لا توجد منتجات",
    noProductsHint: "جرب بحث أو تصنيف مختلف",
    addToCart: "أضف للسلة",
    outOfStock: "نفذ",
    inStock: "متوفر",
    price: "السعر",
    category: "التصنيف",
    shopNow: "تسوق الآن",
    browseCatalog: "تصفح المنتجات",
    featuredProducts: "منتجات مميزة",
    viewAll: "عرض الكل",
    noProductsAvailable: "لا توجد منتجات متاحة حالياً",
    noProductsAvailableHint: "تابع قريباً للوصولات الجديدة.",
    welcome: "مرحباً بكم في متجرنا",
    welcomeDesc:
      "اكتشف منتجات رائعة بأسعار ممتازة. تسوق بثقة مع دفع آمن وشحن سريع.",
    fastShipping: "شحن سريع",
    fastShippingDesc: "توصيل مجاني لجميع الطلبات",
    securePayment: "دفع آمن",
    securePaymentDesc: "بياناتك محمية دائماً",
    easyReturns: "إرجاع سهل",
    easyReturnsDesc: "سياسة إرجاع 30 يوم",
    items: "منتجات",
    emptyCart: "سلتك فارغة",
    emptyCartHint: "يبدو أنك لم تضف أي شيء بعد.",
    browseProducts: "تصفح المنتجات",
  },
};

export type Dict = (typeof dict)["en"];

type LangContextType = {
  lang: Lang;
  dir: "ltr" | "rtl";
  t: Dict;
  setLang: (lang: Lang) => void;
};

const LangContext = React.createContext<LangContextType | null>(null);

function getInitialLang(): Lang {
  if (typeof window === "undefined") return "en";
  const stored = localStorage.getItem("store-lang");
  return stored === "ar" || stored === "en" ? stored : "en";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = React.useState<Lang>(getInitialLang);

  const setLang = React.useCallback((next: Lang) => {
    setLangState(next);
  }, []);

  // Sync <html lang> + <html dir> and persist choice
  React.useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    localStorage.setItem("store-lang", lang);
  }, [lang]);

  const value = React.useMemo(
    () => ({
      lang,
      dir: lang === "ar" ? ("rtl" as const) : ("ltr" as const),
      t: dict[lang],
      setLang,
    }),
    [lang, setLang],
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLanguage() {
  const ctx = React.useContext(LangContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
