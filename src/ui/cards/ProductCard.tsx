"use client";

import Image from "next/image";
import { useCart } from "@/ui/cards/CartContext";
import { useRouter } from "next/navigation";
import { Product } from "@/lib/types";

type Props = {
  p: Product;
  oldPrice?: number;
  currency?: string;
  locale?: string;
};

export default function ProductCard({
  p,
  oldPrice,
  currency = "USD",
  locale = "en-US",
}: Props) {
  const { add } = useCart();
  const router = useRouter();

  const price = fmt(p.price, currency, locale);

  return (
    <div
      className="
        w-[300px] h-[386px]
        flex flex-col gap-[18px]
        bg-[#262626] border border-[#383B42] rounded-[6px]
        p-4 pb-5
      "
    >
      {/* IMAGE WRAPPER */}
      <div className="relative w-[268px] h-[204px] rounded-[6px] bg-white overflow-hidden mx-auto">
        <Image
          src={p.imageUrl}
          alt={p.name}
          fill
          className="object-contain"
        />

        {/* Wishlist (ukryty domyślnie) */}
        <button
          type="button"
          className="absolute right-4 top-4 w-8 h-8 hidden items-center justify-center rounded-[6px] bg-[#262626]"
        >
          <HeartIcon />
        </button>

        {/* Cart */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            add(p);
          }}
          className="absolute left-4 top-4 w-8 h-8 flex items-center justify-center rounded-[6px] bg-[#262626]"
        >
          <CartIcon />
        </button>
      </div>

      {/* DETAILS */}
      <div className="flex flex-col gap-4 w-[268px] mx-auto">
        {/* BADGES */}
        <div className="flex flex-row flex-wrap gap-2 h-9">
          {p.category?.name && (
            <span className="px-[10px] py-[6px] rounded-md bg-[#E5610A] text-[#FDEDD7] text-sm font-medium">
              {p.category.name}
            </span>
          )}
          {/* inne badge’y typu Bestseller / Cashback / Discount można dodać warunkowo */}
        </div>

        {/* TITLE + PRICE */}
        <div className="flex flex-col gap-2">
          <h3
            onClick={() => router.push(`/products/${p.slug}`)}
            className="text-[18px] leading-[28px] text-[#FCFCFC] font-normal line-clamp-1 cursor-pointer"
          >
            {p.name}
          </h3>

          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-[28px] leading-[40px] font-semibold tracking-[-0.01em] text-[#FCFCFC]">
              {price}
            </span>
            {typeof oldPrice === "number" && oldPrice > p.price && (
              <span className="text-[18px] leading-[28px] text-[#E7E7E7] line-through">
                {fmt(oldPrice, currency, locale)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* helper */
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

function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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

function HeartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 21s-6.716-4.935-9.9-9.3C-1.083 6.45 3.134 1.5 7.8 4.2c2.063 1.2 4.2 4.8 4.2 4.8s2.138-3.6 4.2-4.8c4.666-2.7 8.883 2.25 5.7 7.5C18.716 16.065 12 21 12 21z"
        stroke="#FCFCFC"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
