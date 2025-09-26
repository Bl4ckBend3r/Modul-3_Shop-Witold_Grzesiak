"use client";

import { useMemo, useState } from "react";
import Breadcrumb from "@/ui/Breadcrumb";
import Checkbox from "@/ui/Checkbox";
import { useCart } from "@/ui/cards/CartContext";
import CartItem from "@/app/cart/_parts/CartItem";
import CartSummary from "@/app/cart/_parts/CartSummary";

export default function CartPage() {
  const { items, add, remove } = useCart();

  // lokalna selekcja (makietowy „Select All”)
  const [selectedIds, setSelected] = useState<string[]>(
    items.map((it) => it.product.id)
  );
  const allSelected = selectedIds.length === items.length && items.length > 0;

  const toggleAll = () =>
    setSelected(allSelected ? [] : items.map((it) => it.product.id));

  const toggleOne = (id: string) =>
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id]
    );

  // summa liczymy z wybranych (jak na podglądzie)
  const selectedTotal = useMemo(
    () =>
      items
        .filter((it) => selectedIds.includes(it.product.id))
        .reduce((sum, it) => sum + it.product.price * it.qty, 0),
    [items, selectedIds]
  );

  const count = useMemo(
    () => items.reduce((sum, it) => sum + it.qty, 0),
    [items]
  );

  return (
<main className="min-h-[542px] w-full bg-[#1B1B1B] text-white">
  <div>
    <div className="mx-auto max-w-[1440px] px-5 pt-6">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Cart", href: "/cart" },
        ]}
      />
    </div>

    <section className="mx-auto my-6 flex flex-col lg:flex-row max-w-[1440px] gap-12 px-5 pb-10">
      {/* left column */}
      <div className="flex w-full max-w-[889px] flex-col gap-8">
        <label className="flex items-center gap-4 text-white">
          <Checkbox checked={allSelected} onChange={toggleAll} />
          <span className="text-base font-medium leading-6">
            Select All
          </span>
        </label>

        <div className="flex flex-col gap-6">
          {items.length === 0 ? (
            <div className="rounded-md border border-[#383B42] bg-[#262626] p-6 text-[#E7E7E7]">
              Your cart is empty.
            </div>
          ) : (
            items.map((it) => (
              <CartItem
                key={it.product.id}
                item={it}
                selected={selectedIds.includes(it.product.id)}
                onToggle={() => toggleOne(it.product.id)}
                onInc={() => add(it.product, 1)}
                onDec={() =>
                  it.qty > 1
                    ? add(it.product, -1 as unknown as number)
                    : remove(it.product.id)
                }
                onRemove={() => remove(it.product.id)}
              />
            ))
          )}
        </div>
      </div>

      {/* right column */}
      <div>
        <CartSummary total={selectedTotal} count={count} />
      </div>
    </section>
  </div>
</main>

  );
}
