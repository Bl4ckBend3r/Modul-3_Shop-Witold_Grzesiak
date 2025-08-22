"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Props = {
  current: { sort?: string; perPage?: string };
  total: number;
};

export default function Toolbar({ current, total }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const update = (key: "sort" | "perPage", val: string) => {
    const next = new URLSearchParams(sp.toString());
    if (val) next.set(key, val); else next.delete(key);
    // przy zmianie sortowania/liczby reset strony
    next.delete("page");
    router.push(`${pathname}?${next.toString()}`);
  };

  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-neutral-400 hidden md:inline">{total} items</span>

      <label className="inline-flex items-center gap-2">
        <span className="text-neutral-400">Sort by</span>
        <select
          className="bg-neutral-900 border border-neutral-700 rounded-md px-2 py-1 outline-none"
          value={current.sort ?? "latest"}
          onChange={(e) => update("sort", e.target.value)}
        >
          <option value="latest">Latest</option>
          <option value="price_asc">Price: Low → High</option>
          <option value="price_desc">Price: High → Low</option>
        </select>
      </label>

      <label className="inline-flex items-center gap-2">
        <span className="text-neutral-400">Show</span>
        <select
          className="bg-neutral-900 border border-neutral-700 rounded-md px-2 py-1 outline-none"
          value={current.perPage ?? "12"}
          onChange={(e) => update("perPage", e.target.value)}
        >
          <option value="9">9</option>
          <option value="12">12</option>
          <option value="24">24</option>
        </select>
      </label>
    </div>
  );
}
