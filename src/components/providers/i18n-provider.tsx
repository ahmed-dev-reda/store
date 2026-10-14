"use client";

import { NextIntlClientProvider } from "next-intl";
import { useEffect, useRef } from "react";
import ar from "../../../messages/ar.json";
import en from "../../../messages/en.json";
import { useAppSelector } from "@/store/hooks";
import { useAppDispatch } from "@/store/hooks";
import { setLang } from "@/store/languageSlice";

const messages = { ar, en };

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const locale = useAppSelector((state) => state.language.lang);
  const dispatch = useAppDispatch();
  const isInitialEffect = useRef(true);

  useEffect(() => {
    if (isInitialEffect.current) {
      isInitialEffect.current = false;
      const storedLocale = localStorage.getItem("store-lang");
      if (storedLocale === "ar" || storedLocale === "en") {
        document.documentElement.lang = storedLocale;
        document.documentElement.dir = storedLocale === "ar" ? "rtl" : "ltr";
        if (storedLocale !== locale) {
          dispatch(setLang(storedLocale));
          return;
        }
      }
    }

    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    localStorage.setItem("store-lang", locale);
  }, [dispatch, locale]);

  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages[locale]}
      timeZone="Africa/Cairo"
    >
      {children}
    </NextIntlClientProvider>
  );
}
