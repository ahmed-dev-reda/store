"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { ShoppingBag, Loader2, CreditCard, Truck, Banknote, Wallet, BadgePercent, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearCart } from "@/store/cartSlice";
import { getDict } from "@/store/languageSlice";
import { createOrder, validateDiscountCode } from "@/actions/orders";
import type { ValidatedDiscount } from "@/lib/discount";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { VisaCardForm } from "@/components/store/visa-card-form";


export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.cart.items);
  const lang = useAppSelector((s) => s.language.lang);
  const t = getDict(lang);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const { data: session, isPending } = authClient.useSession();
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [paymentMethod, setPaymentMethod] = React.useState<"cod" | "visa">("visa");
  const [isCardValid, setIsCardValid] = React.useState(false);
  const [promoInput, setPromoInput] = React.useState("");
  const [discount, setDiscount] = React.useState<ValidatedDiscount | null>(null);
  const [discountError, setDiscountError] = React.useState<string | null>(null);
  const [isApplyingDiscount, setIsApplyingDiscount] = React.useState(false);

  const subtotal = totalPrice;
  const discountAmount = discount
    ? discount.type === "PERCENTAGE"
      ? (subtotal * discount.amount) / 100
      : Math.min(discount.amount, subtotal)
    : 0;
  const finalTotal = Math.max(0, subtotal - discountAmount);

  const handleApplyDiscount = async () => {
    if (!promoInput.trim()) return;
    setIsApplyingDiscount(true);
    setDiscountError(null);
    try {
      const valid = await validateDiscountCode(promoInput);
      setDiscount(valid);
      setPromoInput("");
    } catch {
      setDiscountError(t.invalidDiscount);
    } finally {
      setIsApplyingDiscount(false);
    }
  };

  React.useEffect(() => {
    if (!isPending && !session) router.push("/login");
  }, [isPending, session, router]);

  const handleCheckout = async () => {
    if (!session) return;
    if (items.length === 0) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const sale = await createOrder({
        paymentMethod,
        discountCode: discount?.code,
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      });
      dispatch(clearCart());
      router.push(`/orders/${sale.id}?placed=true`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : t.failedToPlaceOrder);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!session) return null;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <div className="rounded-full bg-muted p-5">
          <ShoppingBag className="size-10 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold">{t.emptyCart}</h2>
        <p className="text-muted-foreground">{t.addProductsBeforeCheckout}</p>
        <Link
          href="/products"
          className="mt-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          {t.browseProducts}
        </Link>
      </div>
    );
  }

  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t.checkout}</h1>
        <p className="text-muted-foreground mt-1">{t.reviewOrder}</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          {/* Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="size-5" />
                {t.orderItems}
              </CardTitle>
            </CardHeader>
            <CardContent className="divide-y">
              {items.map((item) => (
                <div key={item.productId} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-4">
                    <div className="size-16 shrink-0 rounded-md border bg-muted overflow-hidden">
                      {item.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.imageUrl} alt={item.name} className="size-full object-cover" />
                      ) : (
                        <div className="flex size-full items-center justify-center">
                          <ShoppingBag className="size-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {t.quantityShort}: {item.quantity} × {item.price.toFixed(2)} EGP
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold">{(item.price * item.quantity).toFixed(2)} EGP</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="size-5" />
                {lang === "ar" ? "طريقة الدفع" : "Payment Method"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("visa")}
                  className={`flex items-center gap-3 rounded-lg border-2 p-4 text-start transition-all ${
                    paymentMethod === "visa"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-ring/50"
                  }`}
                >
                  <div className={`rounded-md p-2 ${paymentMethod === "visa" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                    <CreditCard className="size-5" />
                  </div>
                  <div>
                    <p className="font-medium">Visa</p>
                    <p className="text-xs text-muted-foreground">
                      {lang === "ar" ? "دفع آمن بالبطاقة" : "Secure card payment"}
                    </p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("cod")}
                  className={`flex items-center gap-3 rounded-lg border-2 p-4 text-start transition-all ${
                    paymentMethod === "cod"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-ring/50"
                  }`}
                >
                  <div className={`rounded-md p-2 ${paymentMethod === "cod" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                    <Banknote className="size-5" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {lang === "ar" ? "الدفع عند الاستلام" : "Cash on Delivery"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {lang === "ar" ? "ادفع عند التوصيل" : "Pay when delivered"}
                    </p>
                  </div>
                </button>
              </div>
              {paymentMethod === "visa" && (
                <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Wallet className="size-3.5" />
                  {lang === "ar"
                    ? "بيانات بطاقتك محمية ومشفرة بالكامل"
                    : "Your card details are fully encrypted and secure"}
                </p>
              )}
            </CardContent>
          </Card>

          {paymentMethod === "visa" && (
            <VisaCardForm lang={lang} onValidityChange={setIsCardValid} />
          )}

          {/* Shipping notice */}
          <Card className="flex items-center gap-3 p-4">
            <Truck className="size-5 text-primary shrink-0" />
            <p className="text-sm text-muted-foreground">
              {t.fastShipping} — {t.fastShippingDesc.toLowerCase()}
            </p>
          </Card>

          {error && (
            <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
              {error}
            </div>
          )}
        </div>

        {/* Summary */}
        <Card className="h-fit sticky top-24">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="size-5" />
              {t.summary}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>{t.itemsLabel}</span>
                <span>{totalItems}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>{t.shipping}</span>
                <span>{t.free}</span>
              </div>
              {discount && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>
                    {t.discount} ({discount.code})
                  </span>
                  <span>−{discountAmount.toFixed(2)} EGP</span>
                </div>
              )}
            </div>

            {/* Discount code */}
            {discount ? (
              <div className="flex items-center justify-between rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm">
                <span className="flex items-center gap-1.5 font-medium text-emerald-700 dark:text-emerald-300">
                  <BadgePercent className="size-4" />
                  {discount.code}
                  <span className="font-normal text-muted-foreground">
                    {discount.type === "PERCENTAGE"
                      ? `${discount.amount}%`
                      : `${discount.amount.toFixed(2)} EGP`}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => setDiscount(null)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                >
                  <X className="size-3.5" />
                  {t.remove}
                </button>
              </div>
            ) : (
              <div className="space-y-1.5">
                <Label htmlFor="promo">{t.discountCode}</Label>
                <div className="flex gap-2">
                  <Input
                    id="promo"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder={t.discountPlaceholder}
                    disabled={isApplyingDiscount}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleApplyDiscount();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleApplyDiscount}
                    disabled={isApplyingDiscount || !promoInput.trim()}
                  >
                    {isApplyingDiscount ? t.applying : t.apply}
                  </Button>
                </div>
                {discountError && (
                  <p className="text-xs text-destructive">{discountError}</p>
                )}
              </div>
            )}

            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>{t.total}</span>
              <span>{finalTotal.toFixed(2)} EGP</span>
            </div>
            <Button
              onClick={handleCheckout}
              disabled={isSubmitting || (paymentMethod === "visa" && !isCardValid)}
              className="w-full"
              size="lg"
            >
              {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
              {isSubmitting ? t.placingOrder : t.placeOrder}
            </Button>
            {paymentMethod === "visa" && !isCardValid && (
              <p className="text-center text-xs text-muted-foreground">
                {lang === "ar"
                  ? "أكمل بيانات البطاقة بشكل صحيح لإتمام الطلب"
                  : "Complete your card details correctly to place the order"}
              </p>
            )}
            <Link
              href="/products"
              className="block text-center text-sm text-muted-foreground hover:text-foreground"
            >
              {t.browseProducts}
            </Link>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
