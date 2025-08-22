"use client";
import { Category } from "@/lib/types";
import Image from "next/image";
import Button from "@/ui/Button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cdn } from "@/lib/cdn";

const SVG_FALLBACK =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 3'><rect width='4' height='3' fill='#f3f4f6'/></svg>`);

export default function CategoryCarousel({ categories }: { categories: Category[] }) {
  const [idx, setIdx] = useState(0);
  const router = useRouter();
  const cur = categories[idx] ?? categories[0];
  if (!cur) return null;

  const next = () => setIdx((i) => (i + 1) % categories.length);
  const prev = () => setIdx((i) => (i - 1 + categories.length) % categories.length);

  const img = cdn(cur.image || "") || SVG_FALLBACK;

  return (
    <section className="w-full rounded-2xl border border-neutral-200 bg-white p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
        <div className="order-2 lg:order-1">
          <h2 className="text-2xl font-semibold">{cur.name}</h2>
          {cur.description && <p className="mt-2 text-neutral-600">{cur.description}</p>}
          <div className="mt-4 flex items-center gap-3">
            <Button size="l" onClick={() => router.push(`/products?category=${cur.slug}`)}>
              Explore category
            </Button>
            <Button size="l" variant="stroke" onClick={prev} aria-label="Prev">Prev</Button>
            <Button size="l" variant="stroke" onClick={next} aria-label="Next">Next</Button>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-neutral-100">
            <Image
              src={img || "./public/placeholder.png"} 
              alt={cur.name}
              fill
              sizes="(min-width:1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        {categories.map((c, i) => (
          <button
            key={c.id}
            onClick={() => setIdx(i)}
            className={`h-2 rounded-full transition-all ${i === idx ? "w-6 bg-[#EE701D]" : "w-2 bg-neutral-300"}`}
            aria-label={`Go to ${c.name}`}
          />
        ))}
      </div>
    </section>
  );
}
