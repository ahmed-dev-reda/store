"use client";

import * as React from "react";
import { Provider } from "react-redux";
import { store } from "@/store";

const STORAGE_KEY = "store-cart";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  // Persist cart to localStorage on every change
  React.useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const { cart } = store.getState();
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cart.items));
      } catch {}
    });
    return unsubscribe;
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
