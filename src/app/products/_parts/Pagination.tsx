"use client";
import Button from "@/ui/Button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Props = {
  current: Record<string, string | undefined>;
  page: number;
  pages: number;
};

export default function Pagination({ current, page, pages }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const go = (p: number) => {
    const next = new URLSearchParams(sp.toString());
    next.set("page", String(p));
    router.push(`${pathname}?${next.toString()}`);
  };

  const prev = () => page > 1 && go(page - 1);
  const next = () => page < pages && go(page + 1);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Button variant="stroke" size="m" disabled={page <= 1} onClick={prev}>
          ‹ Previous
        </Button>
        <Button variant="stroke" size="m" disabled={page >= pages} onClick={next}>
          Next ›
        </Button>
      </div>

      {/* krótka lista stron (… gdy dużo) */}
      <div className="hidden md:flex items-center gap-2">
        {Array.from({ length: pages }).slice(0, 7).map((_, i) => {
          const p = i + 1;
          const is = p === page;
          return (
            <button
              key={p}
              onClick={() => go(p)}
              className={[
                "min-w-[36px] h-[36px] rounded-md px-3 text-sm",
                is ? "bg-[#EE701D] text-white" : "bg-neutral-900 border border-neutral-700"
              ].join(" ")}
              aria-current={is ? "page" : undefined}
            >
              {p}
            </button>
          );
        })}
        {pages > 7 && <span className="text-neutral-500">…</span>}
      </div>
    </div>
  );
}
