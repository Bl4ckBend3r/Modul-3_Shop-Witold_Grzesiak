// src/app/products/_parts/ProductDetailClient.tsx
"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import Button from "@/ui/Button";
import { useCart } from "@/ui/cards/CartContext";
import type { Product } from "@/lib/types";
import Breadcrumb, { useRegisterBreadcrumb } from "@/ui/Breadcrumb";

/** Dodatkowe typy z API (opcjonalne relacje) */
type ApiImage = { id?: string | number; url: string };
type ApiVariant = { id: string | number; name: string };
type ApiBrand = { id?: string; name: string };
type ApiCategory = { id?: string; name: string; slug?: string };

/** Produkt rozszerzony o używane przez widok pola */
type ApiProduct = Product & {
  imageUrl?: string; // single image (z bazy)
  images?: ApiImage[]; // galeria (opcjonalna relacja)
  brand?: ApiBrand;
  category?: ApiCategory;
  variants?: ApiVariant[];
  description?: string;
  gallery?: string[]; // fallback z wcześniejszej implementacji
  colors?: string[];
  stock?: number;
  shortDescription?: string;
  _count?: { reviews?: number };
  deliveryDate?: string;
};

type Props = {
  product: ApiProduct;
  recommendations?: Array<
    Pick<ApiProduct, "id" | "slug" | "name" | "price" | "imageUrl"> & {
      images?: ApiImage[];
    }
  >;
};

export default function ProductDetailClient({
  product,
  recommendations = [],
}: Props) {
  useRegisterBreadcrumb(product.name, `/products/${product.slug}`);

  const { add } = useCart();

  // Zbuduj galerię: images[] -> url | gallery[] | imageUrl
  const gallery: string[] = [
    ...(product.images?.map((img) => img?.url).filter(Boolean) ?? []),
    ...(product.gallery?.filter(Boolean) ?? []),
    ...(product.imageUrl ? [product.imageUrl] : []),
  ].filter(Boolean) as string[];

  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(10);
  const [color, setColor] = useState(
    (product.colors?.[0] ?? "#111827") as string
  );

  const price = Number(product.price ?? 0);
  const subtotal = useMemo(() => +(price * qty).toFixed(2), [price, qty]);

  const dec = () => setQty((q) => Math.max(1, q - 1));
  const inc = () => setQty((q) => Math.min(product.stock ?? 9999, q + 1));

  const fullDesc =
    product.shortDescription ??
    product.description ??
    "This product combines precision and comfort for everyday and professional use.";

  const [expanded, setExpanded] = useState(false);
  const collapsed =
    fullDesc.length > 260 ? fullDesc.slice(0, 260) + "…" : fullDesc;

  return (
    <>
      <Breadcrumb mode="history" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEWA KOLUMNA: galeria */}
        <div className="lg:col-span-7">
          <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-neutral-900">
            {gallery[activeImg] && (
              <Image
                src={gallery[activeImg]}
                alt={product.name}
                fill
                sizes="(min-width:1024px) 56vw, 100vw"
                className="object-contain"
                priority
              />
            )}
          </div>

          {gallery.length > 1 && (
            <div className="mt-4 flex items-center gap-3">
              {gallery.map((src, i) => (
                <button
                  key={`${src}-${i}`}
                  onClick={() => setActiveImg(i)}
                  className={`relative w-[72px] h-[72px] rounded-md overflow-hidden border ${
                    i === activeImg ? "border-[#EE701D]" : "border-neutral-700"
                  } bg-neutral-900`}
                  aria-label={`Open image ${i + 1}`}
                >
                  <Image
                    src={src}
                    alt={`thumb ${i + 1}`}
                    fill
                    sizes="72px"
                    className="object-contain"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* PRAWA KOLUMNA: treść i akcje */}
        <div className="lg:col-span-5">
          <div className="mb-6">
            <span className="inline-block text-xs px-2 py-0.5 rounded bg-[#1f2937] text-[#F59E0B]">
              {product.category?.name ?? "Products"}
            </span>
            <h1 className="mt-2 text-2xl font-semibold text-neutral-100">
              {product.name}
            </h1>
            <div className="mt-1 text-sm text-neutral-400">
              {product.brand?.name ? `by ${product.brand.name}` : null}
            </div>
            <div className="mt-3 text-[22px] font-semibold text-neutral-100">
              {price ? `$${price.toFixed(2)}` : "-"}
            </div>

            <p className="mt-4 text-sm leading-6 text-neutral-300 max-w-prose">
              {expanded ? fullDesc : collapsed}
            </p>

            {fullDesc.length > 260 && (
              <button
                type="button"
                className="mt-2 text-sm text-[#EE701D] hover:underline"
                onClick={() => setExpanded((s) => !s)}
              >
                {expanded ? "Show less" : "Show more"}
              </button>
            )}
          </div>

          <div className="rounded-xl border border-neutral-700 bg-neutral-900 p-4">
            {/* Kolory */}
            {product.colors?.length ? (
              <div className="mb-4">
                <div className="text-sm text-neutral-400 mb-2">Colors</div>
                <div className="flex gap-2">
                  {product.colors.map((c) => {
                    const selected = c.toLowerCase() === color.toLowerCase();
                    return (
                      <button
                        key={c}
                        title={c}
                        onClick={() => setColor(c)}
                        className={`w-9 h-9 rounded-md border ${
                          selected ? "border-white" : "border-neutral-700"
                        }`}
                        style={{ backgroundColor: c }}
                        aria-pressed={selected}
                      />
                    );
                  })}
                </div>
              </div>
            ) : null}

            {/* Ilość + stan */}
            <div className="mb-4">
              <div className="text-sm text-neutral-400 mb-2">Quantity</div>
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center border border-neutral-700 rounded-md overflow-hidden">
                  <button
                    className="w-9 h-9 grid place-items-center text-neutral-200 hover:bg-neutral-800"
                    onClick={dec}
                    aria-label="Decrease"
                  >
                    –
                  </button>
                  <div className="w-12 h-9 grid place-items-center text-neutral-100">
                    {qty}
                  </div>
                  <button
                    className="w-9 h-9 grid place-items-center text-neutral-200 hover:bg-neutral-800"
                    onClick={inc}
                    aria-label="Increase"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-neutral-500">
                  Stock : {product.stock ?? 0}
                </span>
              </div>
            </div>

            {/* Suma */}
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-neutral-400">Subtotal</span>
              <span className="text-xl font-semibold text-neutral-100">
                {price ? `$${subtotal}` : "-"}
              </span>
            </div>

            {/* CTA */}
            <Button
              size="xl"
              className="w-full"
              onClick={() => add(product as any, qty)}
            >
              Add to Cart
            </Button>
          </div>

          {/* Dostawa */}
          <div className="mt-4">
            <div className="rounded-lg border border-neutral-700 bg-neutral-900 p-3">
              <div className="text-sm font-medium text-neutral-100">
                NexusHub Courier
              </div>
              <div className="text-xs text-neutral-400">
                {product.deliveryDate
                  ? `Estimated arrival ${new Date(
                      product.deliveryDate
                    ).toLocaleDateString("pl-PL", {
                      weekday: "short",
                      day: "2-digit",
                      month: "short",
                      timeZone: "Europe/Warsaw",
                    })}`
                  : "Estimated arrival soon"}
              </div>
            </div>
          </div>

          {/* (opcjonalnie) liczba opinii */}
          {product._count?.reviews !== undefined && (
            <div className="mt-2 text-sm text-neutral-500">
              Reviews: {product._count.reviews}
            </div>
          )}
        </div>

        {/* Rekomendacje */}
        {recommendations.length > 0 && (
          <div className="lg:col-span-12 mt-8">
            <h2 className="text-xl font-semibold mb-4">You may also like</h2>
            <div className="flex gap-4 overflow-x-auto no-scrollbar">
              {recommendations.map((p) => {
                const thumb =
                  p.images?.[0]?.url ?? p.imageUrl ?? gallery[0] ?? "";
                return (
                  <a
                    key={String(p.id)}
                    href={`/products/${p.slug}`}
                    className="w-[220px] shrink-0"
                  >
                    <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-neutral-900">
                      {thumb && (
                        <Image
                          src={thumb}
                          alt={p.name}
                          fill
                          sizes="220px"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="mt-2 text-sm line-clamp-2 text-neutral-200">
                      {p.name}
                    </div>
                    <div className="text-sm font-semibold text-neutral-100">
                      {typeof p.price === "number"
                        ? `$${p.price.toFixed(2)}`
                        : "-"}
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
