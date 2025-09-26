// src/app/products/_parts/ProductDetailClient.tsx
"use client";
import { ShieldCheck } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import Button from "@/ui/Button";
import { useCart } from "@/ui/cards/CartContext";
import type { Product } from "@/lib/types";
import Breadcrumb, { useRegisterBreadcrumb } from "@/ui/Breadcrumb";

type ApiImage = { id?: string | number; url: string };
type ApiBrand = { id?: string; name: string };
type ApiCategory = { id?: string; name: string; slug?: string };

type ApiProduct = Product & {
  imageUrl?: string;
  images?: ApiImage[];
  brand?: ApiBrand;
  category?: ApiCategory;
  description?: string;
  gallery?: string[];
  colors?: string[];
  stock?: number;
  shortDescription?: string;
  _count?: { reviews?: number };
  deliveryDate?: string;
  oldPrice?: number;
};

type Props = {
  product: ApiProduct;
};

/** Losowa data dostawy w zakresie 1–7 dni od dziś */
function getRandomDeliveryDate() {
  const today = new Date();
  const min = 1;
  const max = 7;
  const daysToAdd = Math.floor(Math.random() * (max - min + 1)) + min;
  const date = new Date(today);
  date.setDate(today.getDate() + daysToAdd);
  return date;
}

export default function ProductDetailClient({ product }: Props) {
  useRegisterBreadcrumb(product.name, `/products > ${product.slug}`);
  const { add } = useCart();

  // Galeria
  const gallery: string[] = [
    ...(product.images?.map((img) => img?.url).filter(Boolean) ?? []),
    ...(product.gallery?.filter(Boolean) ?? []),
    ...(product.imageUrl ? [product.imageUrl] : []),
  ].filter(Boolean) as string[];

  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
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

  // Losowanie daty dostawy
  const [deliveryDate] = useState<Date>(() => {
    if (product.deliveryDate) {
      return new Date(product.deliveryDate);
    }
    return getRandomDeliveryDate();
  });

  return (
<main className="w-full overflow-x-clip bg-[#1A1A1A] text-white">
  <div className="w-full flex justify-center">
    <div className="w-full max-w-[1440px] px-4 md:px-8 lg:px-10 flex flex-col gap-10 md:gap-12 lg:gap-14 mx-auto">
      <div />

      {/* Layout */}
      <div className="flex flex-col 2xl:flex-row gap-10 md:gap-12 lg:gap-14">
        {/* LEWA KOLUMNA – galeria i opis */}
        <div className="flex-1 flex flex-col gap-6 md:gap-8 lg:gap-10">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 lg:gap-10">
            {/* Galeria */}
            <div className="flex flex-col gap-6 md:gap-8 w-full md:w-[422px]">
              {/* Główne zdjęcie */}
              <div className="flex flex-col items-start p-3 gap-2 w-full md:w-[422px] h-[260px] md:h-[341px] bg-[#262626] border border-[#383B42] rounded-md">
                <div className="relative w-full h-[220px] md:w-[398px] md:h-[317px] rounded-md overflow-hidden bg-white">
                  {gallery[activeImg] && (
                    <Image
                      src={gallery[activeImg]}
                      alt={product.name}
                      fill
                      sizes="(min-width:1024px) 422px, 100vw"
                      className="object-contain"
                      priority
                    />
                  )}
                </div>
              </div>

              {/* Miniatury */}
              {gallery.length > 1 && (
                <div className="mt-4 flex items-center gap-3 md:gap-4 lg:gap-[16px] overflow-x-auto no-scrollbar">
                  {gallery.map((src, i) => (
                    <button
                      key={`${src}-${i}`}
                      onClick={() => setActiveImg(i)}
                      className={`relative w-[90px] h-[70px] md:w-[130px] md:h-[99px] rounded-md overflow-hidden border ${
                        i === activeImg ? "border-[#F29145]" : "border-neutral-700"
                      } bg-white shrink-0`}
                      aria-label={`Open image ${i + 1}`}
                    >
                      <Image
                        src={src}
                        alt={`thumb ${i + 1}`}
                        fill
                        sizes="90px"
                        className="object-contain"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info o produkcie */}
            <div className="flex flex-col gap-6 md:gap-8 lg:gap-[32px] w-full md:max-w-[427px]">
              {/* Tytuł + Kategoria */}
              <div className="flex flex-col gap-4 md:gap-5">
                <div>
                  <h2 className="text-[22px] md:text-[28px] font-medium leading-8 md:leading-10 text-[#FCFCFC] tracking-[-0.01em] line-clamp-2">
                    {product.name}
                  </h2>
                  {product.brand?.name && (
                    <p className="mt-1 text-sm text-neutral-400">by {product.brand.name}</p>
                  )}
                </div>
                {product.category?.name && (
                  <span className="inline-flex justify-center items-center px-[10px] py-[4px] md:py-[6px] rounded-md bg-[#E5610A] text-[#FDEDD7] text-xs md:text-sm font-medium w-fit">
                    {product.category.name}
                  </span>
                )}
              </div>

              {/* Cena */}
              <div className="flex gap-4 items-center">
                <span className="text-[26px] md:text-[32px] font-medium text-[#FCFCFC]">
                  {price ? `$${price.toFixed(2)}` : "-"}
                </span>
                {product.oldPrice && (
                  <span className="text-base md:text-lg text-[#B0B0B0] line-through">
                    ${product.oldPrice.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Opis */}
              <div>
                <p className="text-sm md:text-base leading-[22px] md:leading-[26px] text-[#FCFCFC] mb-2">
                  {expanded ? fullDesc : collapsed}
                </p>
                {fullDesc.length > 260 && (
                  <button
                    type="button"
                    onClick={() => setExpanded((s) => !s)}
                    className="text-[14px] md:text-[16px] font-medium text-[#F29145] hover:underline"
                  >
                    {expanded ? "See less" : "See more"}
                  </button>
                )}
              </div>

              {/* Dostawa */}
              <div className="flex flex-col gap-3 md:gap-4 mt-2">
                <span className="text-base md:text-lg font-medium text-[#B0B0B0]">
                  Shipping Available
                </span>
                <div className="flex flex-row items-center gap-3 p-3 md:p-4 w-full md:w-[312px] h-auto md:h-[88px] border border-[#FCFCFC] rounded-md">
                  <ShieldCheck className="w-5 h-5 text-green-400 shrink-0" />
                  <div className="flex flex-col gap-1">
                    <span className="text-sm md:text-base font-medium text-[#FCFCFC]">
                      NexusHub Courier
                    </span>
                    <span className="text-xs md:text-sm text-[#E7E7E7]">
                      Estimated arrival{" "}
                      {deliveryDate.toLocaleDateString("pl-PL", {
                        weekday: "short",
                        day: "2-digit",
                        month: "short",
                        timeZone: "Europe/Warsaw",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PRAWA KOLUMNA */}
        <div className="w-full 2xl:w-[423px] flex-shrink-0 flex justify-center 2xl:justify-end mb-10 2xl:mb-0">
          <div className="w-full bg-[#262626] border border-[#383B42] rounded-md p-4 md:p-6 flex flex-col gap-6 md:gap-8">
            {/* Colors */}
            <section>
              <h3 className="text-base md:text-lg font-medium text-[#B0B0B0] mb-2 md:mb-3">
                Colors
              </h3>
              <div className="flex gap-3 md:gap-4">
                {product.colors?.map((c) => {
                  const selected = c.toLowerCase() === color.toLowerCase();
                  return (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={`relative w-[40px] h-[40px] md:w-[54px] md:h-[54px] rounded-md flex items-center justify-center ${
                        selected ? "border-2 border-white" : "border border-[#383B42]"
                      }`}
                      style={{ backgroundColor: c }}
                    >
                      {selected && (
                        <svg
                          className="absolute w-4 h-4 md:w-5 md:h-5 text-black"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Quantity */}
            <section>
              <h3 className="text-base md:text-lg font-medium text-[#B0B0B0] mb-2 md:mb-3">
                Quantity
              </h3>
              <div className="flex items-center gap-3 md:gap-4">
                <div className="flex items-center border border-[#FCFCFC] rounded-md overflow-hidden">
                  <button
                    className="w-8 h-8 md:w-9 md:h-9 grid place-items-center text-[#FCFCFC] hover:bg-neutral-800"
                    onClick={dec}
                  >
                    –
                  </button>
                  <div className="w-10 h-8 md:w-12 md:h-9 grid place-items-center text-[#FCFCFC]">
                    {qty}
                  </div>
                  <button
                    className="w-8 h-8 md:w-9 md:h-9 grid place-items-center text-[#FCFCFC] hover:bg-neutral-800"
                    onClick={inc}
                  >
                    +
                  </button>
                </div>
                <span className="text-sm md:text-base font-medium text-[#FCFCFC]">
                  Stock : {product.stock ?? 0}
                </span>
              </div>
            </section>

            {/* Subtotal */}
            <section className="flex justify-between items-center">
              <span className="text-base md:text-lg font-medium text-[#B0B0B0]">Subtotal</span>
              <span className="text-[22px] md:text-[28px] font-medium text-[#FCFCFC] tracking-[-0.01em]">
                {price ? `$${subtotal}` : "-"}
              </span>
            </section>

            {/* CTA */}
            <section>
              <Button
                size="xl"
                variant="stroke"
                rightIcon={
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7A1 1 0 007 17h10m-4 4a1 1 0 11-2 0 1 1 0 012 0zm6 0a1 1 0 11-2 0 1 1 0 012 0z"
                    />
                  </svg>
                }
                onClick={() => add(product as any, qty)}
                className="w-full"
              >
                Add to Cart
              </Button>
            </section>
          </div>
        </div>
      </div>
    </div>
  </div>
</main>

  );
}
