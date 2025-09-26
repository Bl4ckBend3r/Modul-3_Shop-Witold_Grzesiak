"use client";

import { useState } from "react";
import ProductCard from "@/ui/cards/ProductCard";
import FiltersSidebar from "./_parts/FiltersSidebar";
import TopToolbar from "./_parts/TopToolbar";
import Link from "next/link";
import type { Product, Category } from "@/lib/types";

type Props = {
  items: Product[];
  meta: {
    total: number;
    perPage: number;
    page: number;
    totalPages: number;
    hasPrev: boolean;
    hasNext: boolean;
  };
  categories: Category[];
  params: Record<string, string | undefined>;
};

export default function ProductsClient({
  items,
  meta,
  categories,
  params,
}: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const buildHref = (p: number) => {
    const sp = new URLSearchParams();

    (
      ["category", "priceMin", "priceMax", "promoOnly", "q", "sort"] as const
    ).forEach((k) => {
      const v = params[k];
      if (typeof v === "string" && v) sp.set(k, v);
    });

    sp.set("page", String(p));
    sp.set("perPage", String(meta.perPage));

    return `/products?${sp.toString()}`;
  };

  return (
    <main className="mx-auto max-w-full px-6 py-6 text-white">
      <div className="flex border-t border-[#333333] items-start gap-6">
        {/* Sidebar desktop */}
        <aside className="hidden lg:block  shrink-0">
          <FiltersSidebar categories={categories} current={params} />
        </aside>

        {/* Sidebar mobile – otwierany hamburgerem */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 lg:hidden">
            <div
              className="
                absolute left-0 top-0 h-full w-72 bg-[#1A1A1A] p-4 shadow-lg
                transform transition-transform duration-300 ease-in-out
                translate-x-0 w-[400]
              "
            >
              <button
                onClick={() => setSidebarOpen(false)}
                className="mb-4 border border-[#383B42] rounded px-3 py-1"
              >
                ✕ Zamknij
              </button>
              <FiltersSidebar categories={categories} current={params} />
            </div>
          </div>
          )}
        {/* Główna sekcja z produktami */}
        <section className="flex-1 bg-[#1A1A1A] border-l border-[#333333] pl-6">
          <header className="mb-3 flex items-center justify-between">
            <h1 className="text-[28px] leading-[40px] font-medium">
              {params.category
                ? `Produkty: ${params.category}`
                : ""}
            </h1>

            {/* Hamburger < 1024px */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden border border-[#383B42] rounded px-3 py-1"
            >
              ☰ Filtry
            </button>
          </header>

          <div className="h-5" />
          <TopToolbar />
          <div className="h-7" />

          {items.length === 0 ? (
            <p className="text-neutral-400 mt-6">
              Brak produktów dla wybranych filtrów.
            </p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {items.map((p) => (
                  <ProductCard key={p.id} p={p} currency="USD" />
                ))}
              </div>

              {/* PAGER */}
              <nav className="mt-8 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(
                    (n) => (
                      <Link
                        key={n}
                        href={buildHref(n)}
                        aria-current={n === meta.page ? "page" : undefined}
                        className={[
                          "flex items-center justify-center w-11 h-11 rounded-md text-[16px] font-medium",
                          n === meta.page
                            ? "bg-[#F29145] text-[#262626]"
                            : "text-[#B0B0B0] hover:bg-white/5",
                        ].join(" ")}
                      >
                        {n}
                      </Link>
                    )
                  )}
                </div>
              </nav>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
