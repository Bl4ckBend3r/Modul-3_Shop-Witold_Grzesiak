"use client";
import Slider from "@/ui/Slider";
import BrandCard from "@/ui/cards/BrandCard";
import type { Brand } from "@/lib/types";

export default function Brands({ items }: { items: Brand[] }) {
  return (
    <Slider itemWidth={220} gap={32} className="w-full">
      {items.map((b) => (
        <BrandCard key={b.id} brand={b} />
      ))}
    </Slider>
  );
}
