export async function getFeaturedProducts() {
  try {
    const res = await fetch(
      `https://admin-devtrend.vercel.app/api/store/products?limit=4&status=In Stock`,
      { cache: "no-store" },
    );
    const json = await res.json();
    if (!json.success) return [];
    return json.data as {
      id: string;
      name: string;
      description: string;
      price: number;
      quantity: number;
      imageUrl: string | null;
      category: { id: string; name: string } | null;
      status: string;
    }[];
  } catch {
    return [];
  }
}
