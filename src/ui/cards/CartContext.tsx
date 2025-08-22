"use client";
import { createContext, useContext, useMemo, useState, PropsWithChildren } from "react";
import { Product } from "@/lib/types";
import { useToast } from "../ToastContext";

type CartItem = { product: Product; qty: number };
type Ctx = {
  items: CartItem[];
  add: (p: Product, qty?: number) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const CartCtx = createContext<Ctx | null>(null);

export function CartProvider({ children }: PropsWithChildren) {
  const [items, setItems] = useState<CartItem[]>([]);
  const { notify } = useToast();

  const add = (p: Product, qty = 1) => {
    setItems((prev) => {
      const i = prev.findIndex((it) => it.product.id === p.id);
      const next = [...prev];
      if (i >= 0) next[i] = { ...next[i], qty: next[i].qty + qty };
      else next.push({ product: p, qty });
      return next;
    });
    notify(`Dodano do koszyka: ${p.name}`);
  };

  const remove = (id: string) =>
    setItems((prev) => prev.filter((it) => it.product.id !== id));

  const clear = () => setItems([]);

  const value = useMemo(() => ({ items, add, remove, clear }), [items]);

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export const useCart = () => {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("CartProvider missing");
  return ctx;
};
