// ui/cards/BrandCard.tsx
"use client";
import Image from "next/image";
import { Brand } from "@/lib/types";

export default function BrandCard({ brand }: { brand: Brand }) {
  return (
    <div
      className="w-[220px] h-[190px] shrink-0 box-border
                 rounded-[6px] border border-[#616674]
                 bg-[#262626] p-3
                 flex flex-col items-center justify-center gap-7"
    >
      {/* Logo */}
      <div className="relative w-[160px] h-[72px]">
        <Image
          src={brand.imageUrl}   // <- URL z backendu
          alt={brand.name}
          fill
          sizes="160px"
          className="object-contain"
        />
      </div>

      {/* Nazwa */}
      <div className="text-[20px] leading-[30px] font-medium tracking-[-0.01em] text-[#FCFCFC] text-center">
        {brand.name}
      </div>
    </div>
  );
}

