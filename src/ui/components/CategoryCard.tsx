import Link from "next/link";
import Image from "next/image";

export type Category = {
  id: string | number;
  name: string;
  slug: string;
  image?: string | null; // ikona/obraz z bazy (/api/categories -> pole "image")
};

type Props = {
  category: Category;
  href?: string; // opcjonalnie nadpisanie adresu
};

export default function CategoryCard({ category, href }: Props) {
  const targetHref = href ?? `/products?category=${encodeURIComponent(category.slug)}`;
  const hasImage = !!(category.image && category.image.trim().length > 0);
  const initial = category.name?.[0]?.toUpperCase() ?? "?";

  return (
    <Link
      href={targetHref}
      className="group rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 hover:shadow-lg transition-shadow bg-white/60 dark:bg-zinc-900/60"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          {hasImage ? (
            <Image
              src={category.image as string}
              alt={category.name}
              width={72}
              height={72}
              className="rounded-xl object-contain"
            />
          ) : (
            <div
              aria-hidden
              className="h-[72px] w-[72px] rounded-xl grid place-items-center text-2xl font-semibold
                         bg-gradient-to-br from-zinc-100 to-zinc-200
                         dark:from-zinc-800 dark:to-zinc-700"
            >
              {initial}
            </div>
          )}
          <span className="pointer-events-none absolute inset-0 rounded-xl ring-0 ring-indigo-400/0 group-hover:ring-2 transition" />
        </div>

        <div className="text-center">
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {category.name}
          </p>
        </div>
      </div>
    </Link>
  );
}
