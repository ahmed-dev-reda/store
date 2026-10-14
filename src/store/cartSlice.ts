import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  imageUrl: string | null;
  quantity: number;
};

type CartState = {
  items: CartItem[];
};

const STORAGE_KEY = "store-cart";

function loadInitialCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return [];
}

const initialState: CartState = {
  items: loadInitialCart(),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: {
      reducer(state, action: PayloadAction<Omit<CartItem, "quantity"> & { quantity?: number }>) {
        const { quantity = 1, ...item } = action.payload;
        const existing = state.items.find((i) => i.productId === item.productId);
        if (existing) {
          state.items = state.items.map((i) =>
            i.productId === item.productId ? { ...i, quantity: i.quantity + quantity } : i,
          );
        } else {
          state.items.push({ ...item, quantity });
        }
      },
      prepare(item: Omit<CartItem, "quantity">, quantity = 1) {
        return { payload: { ...item, quantity } };
      },
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.productId !== action.payload);
    },
    updateQuantity(state, action: PayloadAction<{ productId: string; quantity: number }>) {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        state.items = state.items.filter((i) => i.productId !== productId);
        return;
      }
      state.items = state.items.map((i) =>
        i.productId === productId ? { ...i, quantity } : i,
      );
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addItem, removeItem, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
