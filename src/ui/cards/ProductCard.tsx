// ui/cards/ProductCard.tsx
"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/ui/cards/CartContext";
import { Product } from "@/lib/types";

type Props = {
  p: Product;
  /** opcjonalna stara cena (przekreślona) */
  oldPrice?: number;
  /** waluta do formatowania (np. "USD", "PLN") */
  currency?: string;
  /** locale do formatowania (np. "en-US", "pl-PL") */
  locale?: string;
};

export default function ProductCard({
  p,
  oldPrice,
  currency = "USD",
  locale = "en-US",
}: Props) {
  const router = useRouter();
  const { add } = useCart();

  const goToDetails = () => router.push(`/products/${p.slug}`);
  const price = fmt(p.price, currency, locale);

  return (
    <div
      className="
        box-border w-[300px] h-[386px]
        flex flex-col items-start
        gap-[18px] p-4 pb-5
        rounded-[6px] border border-[#383B42]
        bg-[#262626]
      "
      role="group"
    >
      {/* IMAGE 268×204 z białym tłem */}
      <div className="relative w-[268px] h-[204px] isolate">
        <div className="relative w-full h-full ml-[16] mt-[16] rounded-[6px] overflow-hidden bg-[white]">
          <Image
            src={p.imageUrl}
            alt={p.name}
            fill
            sizes="300px"
            className="object-contain"
            onClick={goToDetails}
          />
        </div>

        {/* Koszyk – lewy górny róg */}
        <button
          type="button"
          aria-label="Dodaj do koszyka"
          onClick={(e) => {
            e.stopPropagation();
            add(p);
          }}
          className="
            absolute left-[32] top-[32] w-8 h-8
            inline-flex items-center justify-center
            rounded-[6px] bg-[#262626]
            focus:outline-none focus:ring-2 focus:ring-[#EE701D]/40
          "
        >
          <CartIcon />
        </button>
      </div>

      {/* DETAILS 268×128 */}
      <div className="flex flex-col items-start ml-[16] gap-[16] w-[268px] h-[128px]">
        {/* Badge kategorii (36px wysokości) */}
        {p.category?.name && (
          <div className="flex flex-wrap items-start mt-[18]  gap-[10px] w-[268px] h-[36px]">
            <span
              className="
                inline-flex items-center justify-center
                h-[36px] rounded-[6px] px-[15px] py-[6px]
                bg-[#E5610A] text-[#FDEDD7]
                text-[14px] leading-[24px] font-medium
              "
            >
              {p.category.name}
            </span>
          </div>
        )}

        {/* Nazwa + cena */}
        <div className="flex flex-col items-start gap-2 w-[268px] h-[76px]">
          <h3
            className="
              w-[268px] h-[28px]
              text-[18px] leading-[28px] font-[Inter] text-[Regular]
              text-[#FCFCFC] line-clamp-1 cursor-pointer mb-[10]
            "
            onClick={goToDetails}
            title={p.name}
          >
            {p.name}
          </h3>

          <div className="flex flex-row flex-wrap items-center gap-[10px] w-[268px] h-[40px]">
            <div
              className="
                h-[40px] text-[28px] leading-[40px]
                font-semibold tracking-[-0.01em] text-[#FCFCFC]
              "
            >
              {price}
            </div>

            {typeof oldPrice === "number" && oldPrice > p.price && (
              <div className="h-[28px] text-[18px] leading-[28px] text-[#E7E7E7] line-through">
                {fmt(oldPrice, currency, locale)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===== helpers ===== */
function fmt(v: number, currency: string, locale: string) {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(v);
  } catch {
    return `${v.toFixed(2)} ${currency}`;
  }
}

/* Ikona koszyka 24×24, biała linia i kropki */
function CartIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 5h2l2 12h10l2-8H7"
        stroke="#FCFCFC"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="19" r="1.5" fill="#FCFCFC" />
      <circle cx="17" cy="19" r="1.5" fill="#FCFCFC" />
    </svg>
  );
}
