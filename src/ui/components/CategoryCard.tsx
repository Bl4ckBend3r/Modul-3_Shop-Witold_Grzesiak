// CartContext.tsx
"use client";
import { createContext, useContext, useMemo, useState, PropsWithChildren } from "react";
import type { Product } from "@/lib/types";
import { useToast } from "../ToastContext";

type CartItem = { product: Product; qty: number };
type Ctx = {
  items: CartItem[];
  add: (p: Product, qty?: number) => void;
  inc: (id: string, step?: number) => void;
  dec: (id: string, step?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const CartCtx = createContext<Ctx | null>(null);

export function CartProvider({ children }: PropsWithChildren) {
  const [items, setItems] = useState<CartItem[]>([]);
  const { notify } = useToast();

  const add = (p: Product, qty = 1) => {
    setItems(prev => {
      const i = prev.findIndex(it => it.product.id === p.id);
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i], qty: next[i].qty + qty };
        return next;
      }
      return [...prev, { product: p, qty }];
    });
    if (qty > 0) notify(`Dodano do koszyka: ${p.name}`);
  };

  const setQty = (id: string, qty: number) =>
    setItems(prev =>
      prev.map(it => it.product.id === id ? { ...it, qty: Math.max(1, Math.min(99, Math.floor(qty || 1))) } : it)
    );

  const inc = (id: string, step = 1) =>
    setItems(prev =>
      prev.map(it => it.product.id === id ? { ...it, qty: Math.min(99, it.qty + Math.max(1, step)) } : it)
    );

  const dec = (id: string, step = 1) =>
    setItems(prev =>
      prev.map(it => it.product.id === id ? { ...it, qty: Math.max(1, it.qty - Math.max(1, step)) } : it)
    );

  const remove = (id: string) => setItems(prev => prev.filter(it => it.product.id !== id));
  const clear = () => setItems([]);

  const value = useMemo(() => ({ items, add, inc, dec, setQty, remove, clear }), [items]);
  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export const useCart = () => {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("CartProvider missing");
  return ctx;
};
