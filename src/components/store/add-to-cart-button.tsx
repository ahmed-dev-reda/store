"use client";

import * as React from "react";
import { ShoppingCart, Check } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addItem } from "@/store/cartSlice";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

type Props = {
  product: {
    productId: string;
    name: string;
    price: number;
    imageUrl: string | null;
  };
  size?: "sm" | "default";
};

export function AddToCartButton({ product, size = "sm" }: Props) {
  const dispatch = useAppDispatch();
  const t = useTranslations();
  const [added, setAdded] = React.useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addItem(product));
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <Button size={size} onClick={handleClick} className="transition-all">
      {added ? (
        <>
          <Check className="mr-1.5 size-4" />
          {t("added")}
        </>
      ) : (
        <>
          <ShoppingCart className="mr-1.5 size-4" />
          {t("addToCart")}
        </>
      )}
    </Button>
  );
}
