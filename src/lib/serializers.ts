import type { Category, Customer, Product, Sale, SaleItem } from "@/generated/prisma/client";

export type ProductStatus = "In Stock" | "Low Stock" | "Out of Stock";

export function productStatus(quantity: number): ProductStatus {
  if (quantity <= 0) return "Out of Stock";
  if (quantity < 10) return "Low Stock";
  return "In Stock";
}

export function serializeCategory(category: Category) {
  return { id: category.id, name: category.name };
}

export function serializeProduct(
  product: Product & { category?: Category | null },
) {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: Number(product.price),
    quantity: product.quantity,
    imageUrl: product.imageUrl,
    category: product.category ? serializeCategory(product.category) : null,
    categoryId: product.categoryId,
    status: productStatus(product.quantity),
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}

export function serializeSaleItem(
  item: SaleItem & { product?: { name: string } | null },
) {
  return {
    id: item.id,
    productId: item.productId,
    productName: item.product?.name ?? null,
    quantity: item.quantity,
    unitPrice: Number(item.unitPrice),
    subtotal: Number(item.subtotal),
  };
}

export function serializeSale(
  sale: Sale & {
    customer?: Customer | null;
    items?: (SaleItem & { product?: { name: string } | null })[];
  },
) {
  return {
    id: sale.id,
    status: sale.status,
    paymentMethod: sale.paymentMethod,
    total: Number(sale.total),
    customer: sale.customer
      ? {
          id: sale.customer.id,
          name: sale.customer.name,
          email: sale.customer.email,
        }
      : null,
    customerId: sale.customerId,
    userId: sale.userId,
    items: sale.items?.map(serializeSaleItem) ?? [],
    createdAt: sale.createdAt.toISOString(),
    updatedAt: sale.updatedAt.toISOString(),
  };
}
