export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  imageUrl: string | null;
  category: { id: string; name: string } | null;
  status: string;
};

export type Category = {
  id: string;
  name: string;
};
