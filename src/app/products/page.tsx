import type { Product, Category } from "@/lib/types";
import { headers } from "next/headers";
import ProductsClient from "./ProductsClient";

type Props = {
  searchParams: {
    category?: string;
    priceMin?: string;
    priceMax?: string;
    promoOnly?: string;
    q?: string;
    page?: string;
    perPage?: string;
    sort?: string;
  };
};


export const dynamic = "force-dynamic";


async function getBase() {
  const h = await headers();
  const host =
    h.get("x-forwarded-host") ??
    h.get("host") ??
    process.env.NEXT_PUBLIC_APP_HOST ??
    "localhost:3000";
  const proto =
    h.get("x-forwarded-proto") ?? (process.env.VERCEL ? "https" : "http");
  return `${proto}://${host}`;
}

export default async function ProductsPage({ searchParams }: any) {
  const base = await getBase();

  // Kategorie
  let categories: Category[] = [];
  try {
    const cr = await fetch(`${base}/api/categories`, { cache: "no-store" });
    if (cr.ok) {
      const json = await cr.json();
      categories = Array.isArray(json) ? json : json?.data ?? [];
    }
  } catch {}

  const qs = new URLSearchParams();
  (
    ["category", "priceMin", "priceMax", "promoOnly", "q", "sort"] as const
  ).forEach((k) => {
    const v = searchParams[k];
    if (typeof v === "string" && v) qs.set(k, v);
  });

  const perPage = Math.max(1, Number(searchParams.perPage ?? 9));
  const page = Math.max(1, Number(searchParams.page ?? 1));
  qs.set("perPage", String(perPage));
  qs.set("page", String(page));

  const res = await fetch(`${base}/api/products?${qs.toString()}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Nie udało się pobrać produktów");
  const payload = await res.json();

  const items: Product[] = Array.isArray(payload)
    ? payload
    : payload.items ?? [];
  const meta = Array.isArray(payload)
    ? {
        total: items.length,
        perPage,
        page,
        totalPages: Math.max(1, Math.ceil(items.length / perPage)),
        hasPrev: page > 1,
        hasNext: page < Math.max(1, Math.ceil(items.length / perPage)),
      }
    : payload.meta;

  const buildHref = (p: number) => {
    const sp = new URLSearchParams(qs);
    sp.set("page", String(p));
    sp.set("perPage", String(meta.perPage));
    return `/products?${sp.toString()}`;
  };

  return (
    <ProductsClient
    items={items}
    meta={meta}
    categories={categories}
    params={searchParams}
  />

  );
}
