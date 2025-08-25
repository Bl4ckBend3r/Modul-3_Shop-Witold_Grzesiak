// src/lib/useCartApi.ts
"use client";
import { useCallback, useEffect, useState } from "react";

export type CartProduct = {
  id: string;
  slug?: string;
  name: string;
  imageUrl: string;
  price: number | string | null;
  category?: { id: string; name: string; slug: string } | null;
};

export type CartItem = {
  id: string;                 // ID pozycji (CartItem)
  qty: number;
  price: number | string;     // snapshot (priceAtAdd)
  product: CartProduct;
};

export type CartData = {
  id: string | null;
  currency: string;
  items: CartItem[];
  subtotal: number;
  total: number;
};

type ApiOk<T> = { ok: true; data: T };
type ApiRes = ApiOk<CartData>;

export function useCartApi() {
  const [cart, setCart] = useState<CartData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchCart = useCallback(async () => {
    setIsLoading(true);
    try {
      const r = await fetch("/api/cart", { cache: "no-store" });
      const j: ApiRes = await r.json();
      if (j?.data) setCart(j.data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { void fetchCart(); }, [fetchCart]);

  const add = useCallback(async (productId: string, qty = 1) => {
    await fetch("/api/cart/items", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ productId, qty }),
    });
    await fetchCart();
  }, [fetchCart]);

  const setQty = useCallback(async (itemId: string, qty: number) => {
    await fetch(`/api/cart/items/${itemId}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ qty }),
    });
    await fetchCart();
  }, [fetchCart]);

  const remove = useCallback(async (itemId: string) => {
    await fetch(`/api/cart/items/${itemId}`, { method: "DELETE" });
    await fetchCart();
  }, [fetchCart]);

  const clear = useCallback(async () => {
    await fetch("/api/cart", { method: "DELETE" });
    await fetchCart();
  }, [fetchCart]);

  const items: CartItem[] = cart?.items ?? [];
  const count: number = items.reduce<number>((s, it) => s + it.qty, 0);
  const total: number = items.reduce<number>(
    (s, it) => s + it.qty * Number(it.price ?? it.product?.price ?? 0),
    0
  );

  return { cart, items, count, total, isLoading, add, setQty, remove, clear, refresh: fetchCart };
}
