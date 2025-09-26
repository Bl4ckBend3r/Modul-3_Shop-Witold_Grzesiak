"use client";
import Slider from "@/ui/Slider";
import ProductCard from "@/ui/cards/ProductCard";
import type { Product } from "@/lib/types";

export default function Recommendations({ items }: { items: Product[] }) {
  return (
    <Slider itemWidth={300} gap={32} className="w-full">
      {items.map((p) => (
        <ProductCard key={p.id} p={p} />
      ))}
    </Slider>
  );
}
