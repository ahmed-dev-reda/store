"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { serializeSale } from "@/lib/serializers";
import { applyDiscount, type ValidatedDiscount } from "@/lib/discount";

async function requireStoreUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    throw new Error("UNAUTHORIZED:Authentication required");
  }
  return session.user;
}

function toClientError(error: unknown, fallback: string): Error {
  if (error instanceof Error && error.message.includes(":")) {
    return new Error(error.message.split(":").slice(1).join(":").trim() || fallback);
  }
  return new Error(fallback);
}

async function validateDiscountTx(
  tx: Parameters<Parameters<typeof prisma.$transaction>[0]>[0],
  code: string,
): Promise<ValidatedDiscount> {
  const discount = await tx.discount.findUnique({ where: { code: code.trim() } });
  if (!discount || !discount.active) {
    throw new Error("DISCOUNT_INVALID:Invalid or inactive discount code");
  }
  if (discount.expiresAt && discount.expiresAt < new Date()) {
    throw new Error("DISCOUNT_INVALID:Discount code has expired");
  }
  return {
    code: discount.code,
    type: discount.type,
    amount: Number(discount.amount),
  };
}

export async function validateDiscountCode(code: string): Promise<ValidatedDiscount> {
  const trimmed = code.trim();
  if (!trimmed) throw new Error("Enter a discount code");
  const discount = await prisma.discount.findUnique({ where: { code: trimmed } });
  if (!discount || !discount.active) {
    throw new Error("Invalid or inactive discount code");
  }
  if (discount.expiresAt && discount.expiresAt < new Date()) {
    throw new Error("Discount code has expired");
  }
  return {
    code: discount.code,
    type: discount.type,
    amount: Number(discount.amount),
  };
}

export async function createOrder(input: {
  items: { productId: string; quantity: number }[];
  paymentMethod: "visa" | "cod";
  discountCode?: string;
}) {
  const user = await requireStoreUser();

  if (!input.items || input.items.length === 0) {
    throw new Error("At least one item is required");
  }
  if (input.paymentMethod !== "visa" && input.paymentMethod !== "cod") {
    throw new Error("Invalid payment method");
  }
  for (const item of input.items) {
    if (!item.productId || !Number.isInteger(item.quantity) || item.quantity < 1) {
      throw new Error("Invalid order items");
    }
  }

  try {
    return await prisma.$transaction(
      async (tx) => {
      // Validate discount code server-side — never trust the client
      let discount: ValidatedDiscount | null = null;
      if (input.discountCode?.trim()) {
        discount = await validateDiscountTx(tx, input.discountCode);
      }

      // Load products from database — never trust client prices
      const productIds = input.items.map((i) => i.productId);
      const products = await tx.product.findMany({ where: { id: { in: productIds } } });
      const byId = new Map(products.map((p) => [p.id, p]));

      let subtotal = 0;
      const saleItemsData: {
        productId: string;
        quantity: number;
        unitPrice: number;
        subtotal: number;
      }[] = [];

      for (const item of input.items) {
        const product = byId.get(item.productId);
        if (!product) {
          throw new Error(`VALIDATION_ERROR:Unknown product: ${item.productId}`);
        }
        if (product.quantity < item.quantity) {
          throw new Error(
            `INSUFFICIENT_STOCK:Insufficient stock for "${product.name}" (available: ${product.quantity})`,
          );
        }
        const unitPrice = Number(product.price);
        const lineSubtotal = unitPrice * item.quantity;
        subtotal += lineSubtotal;
        saleItemsData.push({
          productId: product.id,
          quantity: item.quantity,
          unitPrice,
          subtotal: lineSubtotal,
        });
      }

      const { total, discountAmount } = applyDiscount(subtotal, discount);

      const sale = await tx.sale.create({
        data: {
          userId: user.id,
          status: "PENDING",
          paymentMethod: input.paymentMethod,
          total,
          items: { create: saleItemsData },
        },
        include: { customer: true, items: { include: { product: true } } },
      });

      // Decrement stock for all items in parallel — each update is
      // guarded by quantity >= ordered so concurrent orders can't oversell
      await Promise.all(
        input.items.map(async (item) => {
          const updated = await tx.product.updateMany({
            where: { id: item.productId, quantity: { gte: item.quantity } },
            data: { quantity: { decrement: item.quantity } },
          });
          if (updated.count !== 1) {
            throw new Error("INSUFFICIENT_STOCK:Insufficient stock");
          }
          await tx.stockMovement.create({
            data: {
              productId: item.productId,
              type: "OUT",
              quantity: item.quantity,
              reason: `Sale ${sale.id}`,
            },
          });
        }),
      );

      return {
        ...serializeSale(sale),
        subtotal,
        discountCode: discount?.code ?? null,
        discountAmount,
      };
      },
      // Neon serverless latency needs a longer window than the 5s default
      { timeout: 20000, maxWait: 10000 },
    );
  } catch (error) {
    throw toClientError(error, "Failed to place order");
  }
}

export async function getMyOrders() {
  const user = await requireStoreUser();
  try {
    const sales = await prisma.sale.findMany({
      where: { userId: user.id },
      include: { customer: true, items: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return sales.map(serializeSale);
  } catch (error) {
    throw toClientError(error, "Failed to load orders");
  }
}

export async function getMyOrder(id: string) {
  const user = await requireStoreUser();
  try {
    const sale = await prisma.sale.findUnique({
      where: { id },
      include: { customer: true, items: { include: { product: true } } },
    });
    if (!sale || sale.userId !== user.id) return null;
    return serializeSale(sale);
  } catch (error) {
    throw toClientError(error, "Failed to load order");
  }
}
