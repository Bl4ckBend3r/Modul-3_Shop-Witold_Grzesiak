import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import type { Product } from "@/lib/types";

/** ======= PROSTE BACKENDOWE "DB" (dev) ======= */
type CartItem = { product: Product; qty: number };
const CARTS = new Map<string, CartItem[]>();

function getCart(cartId: string): CartItem[] {
  if (!CARTS.has(cartId)) CARTS.set(cartId, []);
  return CARTS.get(cartId)!;
}

/** Zwraca proste podsumowanie */
function summarize(items: CartItem[]) {
  const count = items.reduce((s, i) => s + i.qty, 0);
  const total = items.reduce((s, i) => s + i.qty * i.product.price, 0);
  return { count, total };
}

/** ======= GET /api/cart ======= */
export async function GET() {
  // W Twojej wersji Next cookies() -> Promise, więc musi być await
  const store = await cookies();

  // spróbuj odczytać cartId z ciasteczka, albo wylosuj nowe
  let cartId = store.get("cartId")?.value;
  const isNew = !cartId;
  if (!cartId) cartId = crypto.randomUUID();

  const items = getCart(cartId);
  const summary = summarize(items);

  const res = NextResponse.json({ cartId, items, summary });

  // jeśli nowy użytkownik – ustaw cookie
  if (isNew) {
    res.cookies.set("cartId", cartId, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30, // 30 dni
    });
  }

  return res;
}
