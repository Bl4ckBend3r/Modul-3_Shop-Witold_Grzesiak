// app/cart/page.tsx
"use client";

import { useCart } from "@/ui/cards/CartContext";
import Button from "@/ui/Button";

export default function CartPage() {
  const { items, remove, clear } = useCart();
  const total = items.reduce((s, it) => s + it.product.price * it.qty, 0);

  return (
    <main className="mx-auto w-full max-w-[960px] p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Twój koszyk</h1>

      {items.length === 0 ? (
        <p className="text-neutral-600">Koszyk jest pusty.</p>
      ) : (
        <>
          <ul className="divide-y rounded-xl border">
            {items.map(({ product, qty }) => (
              <li key={product.id} className="flex items-center justify-between p-4 gap-4">
                <div className="flex-1">
                  <div className="font-medium">{product.name}</div>
                  <div className="text-sm text-neutral-600">
                    {qty} × {product.price.toFixed(2)} zł
                  </div>
                </div>
                <div className="text-right font-semibold w-28">
                  {(product.price * qty).toFixed(2)} zł
                </div>
                <Button variant="stroke" size="m" onClick={() => remove(product.id)}>
                  Usuń
                </Button>
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-between">
            <div className="text-lg">
              Suma: <span className="font-semibold">{total.toFixed(2)} zł</span>
            </div>
            <div className="flex gap-3">
              <Button variant="stroke" onClick={clear}>Wyczyść</Button>
              <Button>Przejdź do płatności</Button>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
