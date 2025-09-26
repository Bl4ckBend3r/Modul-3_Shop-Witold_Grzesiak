"use client";
import Image from "next/image";
import { Brand } from "@/lib/types";

export default function BrandCard({ brand }: { brand: Brand }) {
  return (
    <div
      className="w-[220px] h-[190px] shrink-0 mx-auto
                 flex flex-col justify-center items-center gap-6
                 p-3 box-border
                 bg-[#262626] border border-[#616674] rounded-[6px]"
    >
      {/* Logo */}
      <div className="relative w-20 h-20 flex items-center justify-center">
        <Image
          src={brand.imageUrl}
          alt={brand.name}
          fill
          className="object-contain p-2"
          sizes="80px"
        />
      </div>

      {/* Nazwa */}
      <div className="text-[20px] leading-[30px] font-medium tracking-[-0.01em] text-[#FCFCFC] text-center">
        {brand.name}
      </div>
    </div>
  );
}
