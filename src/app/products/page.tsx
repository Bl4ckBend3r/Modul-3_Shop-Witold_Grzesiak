import ProductCard from "@/ui/cards/ProductCard";
import type { Product, Category } from "@/lib/types";
import FiltersSidebar from "./_parts/FiltersSidebar";
import TopToolbar from "./_parts/TopToolbar";
import Link from "next/link";
import { headers } from "next/headers";

type Props = {
  searchParams: Promise<{
    category?: string;
    priceMin?: string;
    priceMax?: string;
    promoOnly?: string;
    q?: string;
    page?: string;
    perPage?: string;
    sort?: string;
  }>;
};

export const dynamic = "force-dynamic";

async function getBase() {
  const h = await headers();
  const host =
    h.get("x-forwarded-host") ??
    h.get("host") ??
    process.env.NEXT_PUBLIC_APP_HOST ??
    "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (process.env.VERCEL ? "https" : "http");
  return `${proto}://${host}`;
}

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams; // Next 15: searchParams to Promise
  const base = await getBase();

  // 1) Kategorie do filtra
  let categories: Category[] = [];
  try {
    const cr = await fetch(`${base}/api/categories`, { cache: "no-store" });
    if (cr.ok) categories = await cr.json();
  } catch {}

  // 2) Zbuduj query do /api/products
  const qs = new URLSearchParams();
  (["category", "priceMin", "priceMax", "promoOnly", "q", "sort"] as const).forEach((k) => {
    const v = params[k];
    if (typeof v === "string" && v) qs.set(k, v);
  });

  const perPage = Math.max(1, Number(params.perPage ?? 9));
  const page = Math.max(1, Number(params.page ?? 1));
  qs.set("perPage", String(perPage));
  qs.set("page", String(page));

  const res = await fetch(`${base}/api/products?${qs.toString()}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Nie udało się pobrać produktów");
  const payload = await res.json();

  const items: Product[] = Array.isArray(payload) ? payload : payload.items ?? [];
  const meta =
    Array.isArray(payload)
      ? {
          total: items.length,
          perPage,
          page,
          totalPages: Math.max(1, Math.ceil(items.length / perPage)),
          hasPrev: page > 1,
          hasNext: page < Math.max(1, Math.ceil(items.length / perPage)),
        }
      : payload.meta;

  const pageItems = items;

  const buildHref = (p: number) => {
    const sp = new URLSearchParams(qs);
    sp.set("page", String(p));
    sp.set("perPage", String(meta.perPage));
    return `/products?${sp.toString()}`;
  };

  const pageNumbers = (() => {
    const nums: number[] = [];
    const push = (n: number) => {
      if (!nums.includes(n) && n >= 1 && n <= meta.totalPages) nums.push(n);
    };
    push(1);
    push(2);
    for (let n = meta.page - 1; n <= meta.page + 1; n++) push(n);
    push(meta.totalPages - 1);
    push(meta.totalPages);
    return nums.sort((a, b) => a - b);
  })();

  return (
    <main className="mx-auto max-w-[1360px] px-[40px] py-[40px] text-white">
      <div className="flex items-start gap-20">
        <FiltersSidebar
          categories={categories}
          current={{
            category: params.category,
            priceMin: params.priceMin,
            priceMax: params.priceMax,
            promoOnly: params.promoOnly,
            q: params.q,
          }}
        />

        <section className="flex-1 rounded-2xl bg-[#0B0B0C] p-6">
          <header className="mb-3">
            <h1 className="text-[28px] leading-[40px] font-medium">
              {params.category ? `Produkty: ${params.category}` : "Wszystkie produkty"}
            </h1>
            <p className="text-neutral-400 text-sm mt-1">{meta.total} produktów</p>
          </header>

          <TopToolbar />

          {pageItems.length === 0 ? (
            <p className="text-neutral-400 mt-6">Brak produktów dla wybranych filtrów.</p>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-x-6 gap-y-[20px] mt-6">
                {pageItems.map((p) => (
                  <ProductCard key={p.id} p={p} currency="USD" />
                ))}
              </div>

              {/* PAGER */}
              <nav className="mt-8 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {pageNumbers.map((n, i) => {
                    const prev = pageNumbers[i - 1];
                    const showEllipsis = prev && n - prev > 1;
                    return (
                      <span key={n} className="flex items-center">
                        {showEllipsis && <span className="mx-2 text-neutral-500">…</span>}
                        <Link
                          href={buildHref(n)}
                          className={
                            n === meta.page
                              ? "px-3 py-1.5 rounded-md bg-[#EE701D] text-black"
                              : "px-3 py-1.5 rounded-md border border-[#383B42] text-white hover:bg-white/5"
                          }
                        >
                          {n}
                        </Link>
                      </span>
                    );
                  })}
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    href={buildHref(Math.max(1, meta.page - 1))}
                    className="px-4 py-2 rounded-md border border-[#383B42] hover:bg-white/5"
                    aria-disabled={!meta.hasPrev}
                  >
                    ← Previous
                  </Link>
                  <Link
                    href={buildHref(Math.min(meta.totalPages, meta.page + 1))}
                    className="px-4 py-2 rounded-md border border-[#383B42] hover:bg-white/5"
                    aria-disabled={!meta.hasNext}
                  >
                    Next →
                  </Link>
                </div>
              </nav>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
