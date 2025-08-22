"use client";

import Link from "next/link";
import CategoryTile from "@/ui/CategoryTile";

type Cat = {
  id: string | number;
  name: string;
  slug: string;
  image?: string | null;
};

export default function CategoryGrid({ categories }: { categories: Cat[] }) {
  if (!categories?.length) return null;

  return (
    <div className="w-full max-w-[1360px] flex flex-row flex-wrap justify-between gap-5">
      {categories.map((c) => (
        <Link
          key={c.id}
          href={`/products?category=${encodeURIComponent(c.slug)}`}
          className="group w-[220px] h-[190px]"
        >
          <CategoryTile title={c.name} image={c.image ?? undefined} />
        </Link>
      ))}
    </div>
  );
}
