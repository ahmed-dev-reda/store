"use server";

import { prisma } from "@/lib/prisma";
import { serializeProduct, serializeCategory } from "@/lib/serializers";
import type { Prisma } from "@/generated/prisma/client";

export async function getStoreProducts(params?: {
  search?: string;
  category?: string;
  limit?: number;
}) {
  const { search, category, limit = 100 } = params ?? {};

  const where: Prisma.ProductWhereInput = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }
  if (category) {
    where.category = { name: { equals: category, mode: "insensitive" } };
  }

  const products = await prisma.product.findMany({
    where,
    include: { category: true },
    take: limit,
    orderBy: { createdAt: "desc" },
  });

  return products.map(serializeProduct);
}

export async function getStoreProduct(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });
  if (!product) return null;
  return serializeProduct(product);
}

export async function getStoreCategories() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });
  return categories.map(serializeCategory);
}
