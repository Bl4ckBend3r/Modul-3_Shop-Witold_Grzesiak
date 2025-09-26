"use client";

import Image from "next/image";
import { Trash2 } from "lucide-react";
import Checkbox from "@/ui/Checkbox";
import { Product } from "@/lib/types";

type Props = {
  item: { product: Product; qty: number };
  selected?: boolean;
  onToggle?: () => void;
  onInc?: () => void;
  onDec?: () => void;
  onRemove?: () => void;
  /** Wariant wyglądu: domyślny (z checkboxem i borderem) lub summary (bez checkboxa/borderu, ale z Write Note) */
  variant?: "default" | "summary";
};

export default function CartItem({
  item,
  selected = false,
  onToggle,
  onInc,
  onDec,
  onRemove,
  variant = "default",
}: Props) {
  const p = item.product;
  const price = Number(p.price) || 0;

  return (
    <div className="flex items-center gap-6">
  {/* Checkbox */}
  {variant === "default" && (
    <Checkbox checked={selected} onChange={onToggle ?? (() => {})} />
  )}

  <div
    className={`flex flex-1 flex-col gap-4 bg-[#262626] p-6 rounded-md ${
      variant === "default" ? "border border-[#383B42]" : ""
    }`}
  >
    <div className="flex flex-col md:flex-row gap-6">
      {/* Image */}
      <div className="flex bg-white h-[138px] w-full md:w-[172px] items-center justify-center rounded-md border border-[#383B42] p-3">
        <Image
          src={p.imageUrl}
          width={148}
          height={114}
          alt={p.name}
          className="h-[114px] w-[148px] object-contain"
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between">
        {/* Header */}
        <div className="flex items-start justify-between">
          <h3 className="text-[20px]/[30px] font-medium text-white">
            {p.name}
          </h3>
          {variant === "default" && (
            <button
              className="hidden md:block h-[30px] w-[30px] text-[#F87171]"
              onClick={onRemove}
            >
              <Trash2 className="h-[30px] w-[30px]" />
            </button>
          )}
        </div>

        <span className="w-fit rounded-md bg-[#E5610A] px-3 py-1 text-sm font-medium text-[#FDEDD7]">
          {p.category?.name ?? "Item"}
        </span>

        {/* Cena */}
        <div className="text-[24px]/[36px] font-medium">${price.toFixed(2)}</div>

        {/* Akcje */}
        <div
          className="
            flex items-center justify-between gap-4
            order-last mt-4
            md:order-none md:mt-0 md:justify-start md:gap-6
          "
        >
          <button className="text-[16px] leading-6 text-[#F29145]">
            Write Note
          </button>

          <div className="hidden md:block h-6 w-px bg-[#848A97]" />

          <div className="flex items-center gap-3 rounded-md border border-white px-4 py-2">
            <button onClick={onDec} aria-label="Decrease" className="grid h-5 w-5 place-items-center">
              <span className="block h-[1.5px] w-3 bg-white" />
            </button>
            <span className="min-w-[1ch] text-sm font-medium">{item.qty}</span>
            <button onClick={onInc} aria-label="Increase" className="grid h-5 w-5 place-items-center">
              <div className="relative h-5 w-5">
                <span className="absolute left-1/2 top-1/2 h-[1.5px] w-3 -translate-x-1/2 -translate-y-1/2 bg-white" />
                <span className="absolute left-1/2 top-1/2 h-3 w-[1.5px] -translate-x-1/2 -translate-y-1/2 bg-white" />
              </div>
            </button>
          </div>

          {variant === "default" && (
            <button
              className="md:hidden h-[30px] w-[30px] text-[#F87171]"
              onClick={onRemove}
            >
              <Trash2 className="h-[30px] w-[30px]" />
            </button>
          )}
        </div>
      </div>
    </div>
  </div>
</div>

  );
}
