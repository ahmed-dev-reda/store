export type ValidatedDiscount = {
  code: string;
  type: string;
  amount: number;
};

export function applyDiscount(
  subtotal: number,
  discount: ValidatedDiscount | null,
): { total: number; discountAmount: number } {
  if (!discount) return { total: subtotal, discountAmount: 0 };
  const discountAmount =
    discount.type === "PERCENTAGE"
      ? (subtotal * discount.amount) / 100
      : Math.min(discount.amount, subtotal);
  return {
    total: Math.max(0, subtotal - discountAmount),
    discountAmount,
  };
}
