"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Checkbox } from "@/ui/Checkbox";
import Toggle from "@/ui/Toggle";
import InputField from "@/ui/InputField";
import Slider from "@/ui/Slider";
import Dropdown from "@/ui/Dropdown";
import type { Category } from "@/lib/types";

type Props = {
  categories: Category[];
  current: {
    category?: string;
    priceMin?: string;
    priceMax?: string;
    promoOnly?: string; // "1" | undefined
    q?: string;
  };
};

export default function FiltersSidebar({ categories, current }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const selected = useMemo(
    () => new Set((current.category ?? "").split(",").filter(Boolean)),
    [current.category]
  );

  const [checked, setChecked] = useState<Set<string>>(selected);
  const [promo, setPromo] = useState<boolean>(
    (current.promoOnly ?? "") === "1"
  );
  const [q, setQ] = useState(current.q ?? "");
  const [min, setMin] = useState(current.priceMin ?? "");
  const [max, setMax] = useState(current.priceMax ?? "");

  const apply = () => {
    const next = new URLSearchParams(sp.toString());

    const csv = Array.from(checked).join(",");
    csv ? next.set("category", csv) : next.delete("category");

    q ? next.set("q", q) : next.delete("q");
    min ? next.set("priceMin", min) : next.delete("priceMin");
    max ? next.set("priceMax", max) : next.delete("priceMax");
    promo ? next.set("promoOnly", "1") : next.delete("promoOnly");

    next.delete("page"); // reset paginacji przy zmianie filtrów
    router.push(`${pathname}?${next.toString()}`);
  };

  const updateFilters = (params: {
    category?: Set<string>;
    q?: string;
    min?: string;
    max?: string;
    promo?: boolean;
  }) => {
    const next = new URLSearchParams(sp.toString());

    if (params.category) {
      const csv = Array.from(params.category).join(",");
      csv ? next.set("category", csv) : next.delete("category");
    }

    if (params.q !== undefined) {
      params.q ? next.set("q", params.q) : next.delete("q");
    }

    if (params.min !== undefined) {
      params.min ? next.set("priceMin", params.min) : next.delete("priceMin");
    }

    if (params.max !== undefined) {
      params.max ? next.set("priceMax", params.max) : next.delete("priceMax");
    }

    if (params.promo !== undefined) {
      params.promo ? next.set("promoOnly", "1") : next.delete("promoOnly");
    }

    next.delete("page"); // reset strony
    router.push(`${pathname}?${next.toString()}`);
  };

  const clear = () => {
    const next = new URLSearchParams(sp.toString());
    ["category", "q", "priceMin", "priceMax", "promoOnly", "page"].forEach(
      (k) => next.delete(k)
    );
    router.push(`${pathname}?${next.toString()}`);
  };

  return (
    <aside className="flex flex-col items-center p-[40px] gap-[52px] w-[363px]  rounded-2xl bg-white text-black gap-y-[60]">
      <div className="w-full flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filtry</h2>
        <button
          className="text-sm text-neutral-500 hover:text-neutral-800"
          onClick={clear}
        >
          Wyczyść
        </button>
      </div>

      {/* Kategorie */}
      <section className="w-full">
        <h3 className="mb-3 text-sm font-medium text-neutral-700">Kategorie</h3>
        <div className="flex flex-col gap-3">
          {categories.map((c) => {
            const isOn = checked.has(c.slug);
            return (
              <Checkbox
                key={c.id}
                id={`cat-${c.id}`}
                size="l"
                checked={isOn}
                onChange={(n) => {
                  const cp = new Set(checked);
                  n ? cp.add(c.slug) : cp.delete(c.slug);
                  setChecked(cp);
                  updateFilters({ category: cp });
                }}
                label={c.name}
              />
            );
          })}
        </div>
      </section>

      {/* Cena (min/max) */}
      <section className="w-full">
        <h3 className="mb-3 text-sm font-medium text-neutral-700">Cena</h3>
        <div className="grid grid-cols-1 gap-3">
          <InputField
            size="xl"
            type="leftButton"
            placeholder="$ Min Price"
            inputMode="decimal"
            value={min}
            onChange={(e) => {
              const v = e.currentTarget.value;
              setMin(v);
              updateFilters({ min: v });
            }}
            className="w-[263px]"
            rightNode={
              <Dropdown
                options={["USD", "EUR", "PLN"]}
                value="USD"
                onChange={(val) => console.log("Currency:", val)}
              />
            }
          />

          <InputField
            size="xl"
            type="leftButton"
            placeholder="$ Max Price"
            inputMode="decimal"
            value={max}
            onChange={(e) => {
              const v = e.currentTarget.value;
              setMax(v);
              updateFilters({ max: v });
            }}
            className="w-[263px]"
            rightNode={
              <Dropdown
                options={["USD", "EUR", "PLN"]}
                value="USD"
                onChange={(val) => console.log("Currency:", val)}
              />
            }
          />
        </div>
        {/* opcjonalnie Slider UI – sam w sobie to layoutowy helper */}
        <div className="mt-3">
          <Slider>
            <div className="w-[200px] bg-neutral-100 rounded h-2" />
          </Slider>
        </div>
      </section>

      {/* Promocje */}
      <section className="w-full flex items-center justify-between">
        <span className="text-sm font-medium text-neutral-700">
          Tylko promocje
        </span>
        <Toggle
          checked={promo}
          onChange={(val) => {
            setPromo(val);
            updateFilters({ promo: val });
          }}
          size="m"
        />
      </section>
    </aside>
  );
}
