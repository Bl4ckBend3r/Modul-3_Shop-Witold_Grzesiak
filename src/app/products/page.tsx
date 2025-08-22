import ProductCard from "@/ui/cards/ProductCard";
import type { Product, Category } from "@/lib/types";
import { headers } from "next/headers";
import FiltersSidebar from "./_parts/FiltersSidebar";
import TopToolbar from "./_parts/TopToolbar";
import Link from "next/link";

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
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto =
    h.get("x-forwarded-proto") ?? (process.env.VERCEL ? "https" : "http");
  if (!host) throw new Error("Brak nagłówka host – nie można zbudować URL");
  return `${proto}://${host}`;
}

export default async function ProductsPage({ searchParams }: Props) {
  const base = await getBase();

  // kategorie do filtra
  let categories: Category[] = [];
  try {
    const cr = await fetch(new URL("/api/categories", base), {
      cache: "no-store",
    });
    if (cr.ok) categories = await cr.json();
  } catch {}

  // pobieramy produkty wg filtrów
  const url = new URL("/api/products", base);
  for (const [k, v] of Object.entries(searchParams))
    if (v) url.searchParams.set(k, v);
  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error("Nie udało się pobrać produktów");

  const payload = await res.json();
  const items: Product[] = Array.isArray(payload)
    ? payload
    : payload.items ?? [];
  const total: number = Array.isArray(payload)
    ? payload.length
    : payload.total ?? items.length;

  // paginacja
  const perPage = Math.max(1, Number(searchParams.perPage ?? 9)); // 3x3
  const page = Math.max(1, Number(searchParams.page ?? 1));
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const clampedPage = Math.min(page, totalPages);
  const start = (clampedPage - 1) * perPage;
  const pageItems = items.slice(start, start + perPage);

  const buildHref = (p: number) => {
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(searchParams)) {
      if (typeof v === "string" && v.length) sp.set(k, v);
    }
    sp.set("page", String(p));
    sp.set("perPage", String(perPage));
    return `/products?${sp.toString()}`;
  };

  // krótkie listy numerów 1 … n
  const pageNumbers = (() => {
    const nums: number[] = [];
    const push = (n: number) => {
      if (!nums.includes(n) && n >= 1 && n <= totalPages) nums.push(n);
    };
    push(1);
    push(2);
    for (let n = clampedPage - 1; n <= clampedPage + 1; n++) push(n);
    push(totalPages - 1);
    push(totalPages);
    return nums.sort((a, b) => a - b);
  })();

  return (
    <main className="mx-auto max-w-[1360px] px-[40px] py-[40px] text-white">
      <div className="flex items-start gap-20">
        <FiltersSidebar
          categories={categories}
          current={{
            category: searchParams.category,
            priceMin: searchParams.priceMin,
            priceMax: searchParams.priceMax,
            promoOnly: searchParams.promoOnly,
            q: searchParams.q,
          }}
        />

        <section className="flex-1 rounded-2xl bg-[#0B0B0C] p-6">
          <header className="mb-3">
            <h1 className="text-[28px] leading-[40px] font-medium">
              {searchParams.category
                ? `Produkty: ${searchParams.category}`
                : "Wszystkie produkty"}
            </h1>
            <p className="text-neutral-400 text-sm mt-1">{total} produktów</p>
          </header>

          <TopToolbar />

          {pageItems.length === 0 ? (
            <p className="text-neutral-400 mt-6">
              Brak produktów dla wybranych filtrów.
            </p>
          ) : (
            <>
              {/* 3 × 3 (max 9) */}
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
                        {showEllipsis && (
                          <span className="mx-2 text-neutral-500">…</span>
                        )}
                        <Link
                          href={buildHref(n)}
                          className={
                            n === clampedPage
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
                    href={buildHref(Math.max(1, clampedPage - 1))}
                    className="px-4 py-2 rounded-md border border-[#383B42] hover:bg-white/5"
                    aria-disabled={clampedPage === 1}
                  >
                    ← Previous
                  </Link>
                  <Link
                    href={buildHref(Math.min(totalPages, clampedPage + 1))}
                    className="px-4 py-2 rounded-md border border-[#383B42] hover:bg-white/5"
                    aria-disabled={clampedPage === totalPages}
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
