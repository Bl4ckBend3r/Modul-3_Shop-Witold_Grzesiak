"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Dropdown from "@/ui/Dropdown";

const SORT_OPTIONS = [
  { label: "Latest", value: "latest" },
  { label: "Price: Low → High", value: "price_asc" },
  { label: "Price: High → Low", value: "price_desc" },
  { label: "Name: A → Z", value: "name_asc" },
  { label: "Name: Z → A", value: "name_desc" },
];

const PER_PAGE = ["9", "12", "16", "20"];

export default function TopToolbar() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const currentSort = sp.get("sort") ?? "latest";
  const currentPerPage = sp.get("perPage") ?? "9";

  const push = (nextParams: Record<string, string | null>) => {
    const next = new URLSearchParams(sp.toString());
    Object.entries(nextParams).forEach(([k, v]) =>
      v ? next.set(k, v) : next.delete(k)
    );
    next.delete("page"); // reset paginacji
    router.push(`${pathname}?${next.toString()}`);
  };

  return (
    <div className="mb-[20] flex items-center gap-6">
      {/* Sort by */}
      <div className="flex items-center gap-[30]">
        <span className="text-sm text-neutral-400">Sort by</span>
        <div className="w-[140px] h-[40px]">
          <Dropdown
            embedded
            size="m"
            label="Latest"
            options={SORT_OPTIONS.map(o => o.label)}
            value={SORT_OPTIONS.find(o => o.value === currentSort)?.label}
            onChange={(label) => {
              const value = SORT_OPTIONS.find(o => o.label === label)?.value ?? "latest";
              push({ sort: value });
            }}
            className="w-full h-full "
          />
        </div>
      </div>

      {/* Show */}
      <div className="flex items-center  gap-[30]">
        <span className="text-sm text-neutral-400">Show</span>
        <div className="w-[80px] h-[40px]">
          <Dropdown
            embedded
            size="m"
            label="9"
            options={PER_PAGE}
            value={currentPerPage}
            onChange={(val) => push({ perPage: val })}
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}
