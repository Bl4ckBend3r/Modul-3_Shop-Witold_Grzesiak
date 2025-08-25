"use client";

import Image from "next/image";
import { Trash2 } from "lucide-react";
import Checkbox from "@/ui/Checkbox";
import Button from "@/ui/Button";
import { Product } from "@/lib/types";

type Props = {
  item: { product: Product; qty: number };
  selected: boolean;
  onToggle: () => void;
  onInc: () => void;
  onDec: () => void;
  onRemove: () => void;
};

export default function CartItem({
  item,
  selected,
  onToggle,
  onInc,
  onDec,
  onRemove,
}: Props) {
  const p = item.product;

  return (
    <div className="flex items-center gap-6">
      <Checkbox checked={selected} onChange={onToggle} />

      <div className="flex flex-1 flex-col justify-center gap-8 rounded-md border border-[#383B42] bg-[#262626] p-6">
        <div className="flex items-center gap-8">
          {/* Image */}
          <div className="flex h-[138px] w-[172px] items-center justify-center rounded-md border border-[#383B42] p-3">
            <Image
              src={p.imageUrl}
              width={148}
              height={114}
              alt={p.name}
              className="h-[114px] w-[148px] rounded-md object-contain"
            />
          </div>

          {/* Content */}
          <div className="flex w-full flex-1 flex-col gap-4">
            {/* Header */}
            <div className="flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <h3 className="text-[20px]/[30px] font-medium tracking-[-0.01em] text-white">
                  {p.name}
                </h3>
                <button
                  className="h-[30px] w-[30px] text-[#F87171]"
                  onClick={onRemove}
                  aria-label={`Remove ${p.name}`}
                  title="Remove"
                >
                  <Trash2 className="h-[30px] w-[30px]" />
                </button>
              </div>
              <span className="inline-flex h-9 items-center rounded-md bg-[#E5610A] px-3 text-sm font-medium text-[#FDEDD7]">
                {p.category?.name ?? "Item"}
              </span>
            </div>

            {/* Price + qty */}
            <div className="flex items-center justify-between">
              <div className="text-[24px]/[36px] font-medium tracking-[-0.01em]">
                ${p.price.toFixed(2)}
              </div>

              <div className="flex items-center gap-6">
                <button className="text-[16px] leading-6 text-[#F29145]">
                  Write Note
                </button>
                <div className="h-6 w-px bg-[#848A97]" />
                <div className="flex items-center gap-3 rounded-md border border-white px-5 py-2">
                  <button
                    onClick={onDec}
                    aria-label="Decrease quantity"
                    className="grid h-5 w-5 place-items-center"
                  >
                    <span className="block h-[1.5px] w-3 bg-white" />
                  </button>
                  <span className="min-w-[1ch] text-sm font-medium leading-6">
                    {item.qty}
                  </span>
                  <button
                    onClick={onInc}
                    aria-label="Increase quantity"
                    className="grid h-5 w-5 place-items-center"
                  >
                    <div className="relative h-5 w-5">
                      <span className="absolute left-1/2 top-1/2 h-[1.5px] w-3 -translate-x-1/2 -translate-y-1/2 bg-white" />
                      <span className="absolute left-1/2 top-1/2 h-3 w-[1.5px] -translate-x-1/2 -translate-y-1/2 bg-white" />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> 
    </div>
  );
}
