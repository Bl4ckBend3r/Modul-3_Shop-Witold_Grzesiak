export type CartLine<Product> = { product: Product; qty: number };

export interface CartStore<Product> {
  get(id: string): CartLine<Product>[] | undefined;
  set(id: string, items: CartLine<Product>[]): void;
  ensure(id: string): CartLine<Product>[];
}

const g = globalThis as unknown as { __CART_STORE?: Map<string, any> };
if (!g.__CART_STORE) g.__CART_STORE = new Map<string, any>();

export const cartStore: CartStore<any> = {
  get(id) {
    return g.__CART_STORE!.get(id);
  },
  set(id, items) {
    g.__CART_STORE!.set(id, items);
  },
  ensure(id) {
    if (!g.__CART_STORE!.has(id)) g.__CART_STORE!.set(id, []);
    return g.__CART_STORE!.get(id);
  },
};

export function cartTotals<Product extends { price: number }>(
  items: CartLine<Product>[]
) {
  const count = items.reduce((s, it) => s + it.qty, 0);
  const total = items.reduce((s, it) => s + it.qty * it.product.price, 0);
  return { count, total };
}
