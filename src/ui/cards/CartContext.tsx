"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  useCallback,
  PropsWithChildren,
} from "react";
import { Product } from "@/lib/types";
import { useToast } from "../ToastContext";
import { useSession } from "next-auth/react";

type CartItem = { product: Product; qty: number };
type Ctx = {
  items: CartItem[];
  add: (p: Product, qty?: number) => Promise<void>;
  remove: (id: string) => Promise<void>;
  clear: () => Promise<void>;
  increase: (id: string) => Promise<void>;
  decrease: (id: string) => Promise<void>;
};

type CartItemDTO = {
  product: Product;
  qty: number;
};

const CartCtx = createContext<Ctx | null>(null);

export function CartProvider({ children }: PropsWithChildren) {
  const [items, setItems] = useState<CartItem[]>([]);
  const { notify } = useToast();
  const { data: session } = useSession();

  /** Pobierz userId z sesji */
  const userId = session?.user?.id;

  /** Odśwież koszyk z backendu */
  const refresh = useCallback(async () => {
    const res = await fetch(`/api/cart${userId ? `?userId=${userId}` : ""}`);

    if (res.ok) {
      const data = await res.json();
      if (data?.items) {
        setItems(
          (data.items as CartItemDTO[]).map((it) => ({
            product: it.product,
            qty: it.qty,
          }))
        );
      } else {
        setItems([]);
      }
    }
  }, [userId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  /** Dodaj produkt */
  const add = useCallback(
    async (p: Product, qty = 1) => {
      try {
        const res = await fetch("/api/cart/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, productId: p.id, qty }),
        });

        if (!res.ok) throw new Error("Add to cart failed");

        await refresh();
        notify(`Dodano do koszyka: ${p.name}`);
      } catch (err) {
        console.error("Cart add error:", err);
        notify("Błąd przy dodawaniu do koszyka");
      }
    },
    [userId, refresh, notify]
  );

  /** Zwiększ ilość */
  const increase = useCallback(
    async (id: string) => {
      const item = items.find((it) => it.product.id === id);
      if (item) {
        await add(item.product, 1);
      }
    },
    [items, add]
  );

  /** Zmniejsz ilość */
  const decrease = useCallback(
    async (id: string) => {
      const res = await fetch("/api/cart/decrease", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId: id }),
      });
      if (res.ok) {
        await refresh();
      }
    },
    [userId, refresh]
  );

  /** Usuń produkt */
  const remove = useCallback(
    async (id: string) => {
      const res = await fetch("/api/cart/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId: id }),
      });
      if (res.ok) {
        await refresh();
      }
    },
    [userId, refresh]
  );

  /** Wyczyść koszyk */
  const clear = useCallback(async () => {
    const res = await fetch("/api/cart/clear", { method: "POST" });
    if (res.ok) {
      await refresh();
    }
  }, [refresh]);

  const value = useMemo(
    () => ({ items, add, remove, clear, increase, decrease }),
    [items, add, remove, clear, increase, decrease]
  );

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export const useCart = () => {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("CartProvider missing");
  return ctx;
};
