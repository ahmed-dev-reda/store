"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CreditCard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function luhnCheck(num: string): boolean {
  const digits = num.replace(/\D/g, "");
  if (digits.length < 13 || digits.length > 19) return false;
  let sum = 0;
  let double = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = Number(digits[i]);
    if (double) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    double = !double;
  }
  return sum % 10 === 0;
}

const visaSchema = z.object({
  cardholder: z
    .string()
    .trim()
    .min(2, { message: "Enter the name on the card" })
    .max(100),
  cardNumber: z
    .string()
    .transform((v) => v.replace(/\D/g, ""))
    .refine((v) => v.length === 16, { message: "Card number must be 16 digits" })
    .refine((v) => luhnCheck(v), { message: "Invalid card number" }),
  expiry: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, { message: "Use MM/YY format" })
    .refine(
      (v) => {
        const [mm, yy] = v.split("/").map(Number);
        const now = new Date();
        const expYear = 2000 + yy;
        const expMonth = mm;
        return (
          expYear > now.getFullYear() ||
          (expYear === now.getFullYear() && expMonth >= now.getMonth() + 1)
        );
      },
      { message: "Card is expired" },
    ),
  cvc: z
    .string()
    .regex(/^\d{3,4}$/, { message: "CVC must be 3–4 digits" }),
});

export type VisaFormData = z.infer<typeof visaSchema>;

type Props = {
  lang: "en" | "ar";
  onValidityChange: (valid: boolean) => void;
};

const labels = {
  en: {
    title: "Card Details",
    cardholder: "Cardholder Name",
    cardholderPlaceholder: "John Doe",
    cardNumber: "Card Number",
    cardNumberPlaceholder: "4242 4242 4242 4242",
    expiry: "Expiry",
    expiryPlaceholder: "MM/YY",
    cvc: "CVC",
    cvcPlaceholder: "123",
  },
  ar: {
    title: "بيانات البطاقة",
    cardholder: "اسم حامل البطاقة",
    cardholderPlaceholder: "الاسم كما يظهر على البطاقة",
    expiry: "تاريخ الانتهاء",
    expiryPlaceholder: "شهر/سنة",
    cardNumber: "رقم البطاقة",
    cardNumberPlaceholder: "4242 4242 4242 4242",
    cvc: "رمز الأمان",
    cvcPlaceholder: "123",
  },
};

function formatCardNumber(value: string): string {
  return value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, "$1 ");
}

function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export function VisaCardForm({ lang, onValidityChange }: Props) {
  const t = labels[lang];
  const {
    register,
    setValue,
    trigger,
    formState: { errors, isValid },
  } = useForm<VisaFormData>({
    resolver: zodResolver(visaSchema),
    mode: "onChange",
    defaultValues: { cardholder: "", cardNumber: "", expiry: "", cvc: "" },
  });

  React.useEffect(() => {
    onValidityChange(isValid);
  }, [isValid, onValidityChange]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <CreditCard className="size-5" />
          {t.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="cardholder">{t.cardholder}</Label>
          <Input
            id="cardholder"
            placeholder={t.cardholderPlaceholder}
            autoComplete="cc-name"
            {...register("cardholder")}
          />
          {errors.cardholder && (
            <p className="text-xs text-destructive">{errors.cardholder.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="cardNumber">{t.cardNumber}</Label>
          <Input
            id="cardNumber"
            inputMode="numeric"
            placeholder={t.cardNumberPlaceholder}
            autoComplete="cc-number"
            {...register("cardNumber", {
              onChange: async (e) => {
                const formatted = formatCardNumber(e.target.value);
                setValue("cardNumber", formatted, { shouldValidate: true });
                await trigger("cardNumber");
              },
            })}
          />
          {errors.cardNumber && (
            <p className="text-xs text-destructive">{errors.cardNumber.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="expiry">{t.expiry}</Label>
            <Input
              id="expiry"
              inputMode="numeric"
              placeholder={t.expiryPlaceholder}
              autoComplete="cc-exp"
              {...register("expiry", {
                onChange: (e) => {
                  setValue("expiry", formatExpiry(e.target.value), {
                    shouldValidate: true,
                  });
                },
              })}
            />
            {errors.expiry && (
              <p className="text-xs text-destructive">{errors.expiry.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cvc">{t.cvc}</Label>
            <Input
              id="cvc"
              inputMode="numeric"
              placeholder={t.cvcPlaceholder}
              autoComplete="cc-csc"
              maxLength={4}
              {...register("cvc", {
                onChange: (e) => {
                  setValue("cvc", e.target.value.replace(/\D/g, "").slice(0, 4), {
                    shouldValidate: true,
                  });
                },
              })}
            />
            {errors.cvc && (
              <p className="text-xs text-destructive">{errors.cvc.message}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
