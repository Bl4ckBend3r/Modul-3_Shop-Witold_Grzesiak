import type { Brand, Category, Product } from "@/lib/types";

const MODE = process.env.NEXT_PUBLIC_API_MODE ?? "mock"; // "mock" | "proxy" | "direct"
const DIRECT = process.env.NEXT_PUBLIC_API_URL;       
const SITE  = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"; 

function base() {
  if (MODE === "mock")  return "/api";
  if (MODE === "proxy") return "/api/proxy";
  // direct
  if (!DIRECT || !/^https?:\/\//.test(DIRECT)) {
    throw new Error('Brak lub zły NEXT_PUBLIC_API_URL dla trybu "direct"');
  }
  return DIRECT.replace(/\/+$/, "");
}

// ZAWSZE budujemy bezwzględny URL (serwer tego wymaga)
function absolute(urlOrPath: string) {
  // jeśli już jest http/https – zostaw
  if (/^https?:\/\//.test(urlOrPath)) return urlOrPath;
  // inaczej dobuduj origin na bazie SITE
  return new URL(urlOrPath, SITE).toString(); 
}

async function json<T>(path: string): Promise<T> {
  const b = base();
  // dbamy o pojedynczy slash: base('/api') + path('/categories') => '/api/categories'
  const rel = path.startsWith("/") ? path : `/${path}`;
  const full = `${b}${rel}`;
  const url  = absolute(full); // 👈 teraz mamy pełny URL, np. http://localhost:3000/api/categories

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} @ ${url}`);
  return res.json() as Promise<T>;
}

export const getCategories = () => json<Category[]>("/categories");
export const getBrands = () => json<Brand[]>("/brands");
export const getRandomRecommendations = (limit = 6) =>
  json<Product[]>(`/products/recommendations?limit=${limit}`);
