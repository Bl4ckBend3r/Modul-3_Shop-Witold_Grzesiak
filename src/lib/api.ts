import type { Brand, Category, Product } from "@/lib/types";
import { headers } from "next/headers";

const MODE = process.env.NEXT_PUBLIC_API_MODE ?? "direct";
const DIRECT = process.env.NEXT_PUBLIC_API_URL;

async function getSite() {
  const h = await headers();
  const host =
    h.get("x-forwarded-host") ??
    h.get("host") ??
    process.env.NEXT_PUBLIC_SITE_URL;
  const proto =
    h.get("x-forwarded-proto") ?? (process.env.VERCEL ? "https" : "http");
  return `${proto}://${host}`;
}

async function base() {
  if (MODE === "mock") return ""; // 👈 wcześniej było "/api"
  if (MODE === "proxy") return "/api/proxy";
  if (!DIRECT || !/^https?:\/\//.test(DIRECT)) {
    return await getSite();
  }
  return DIRECT.replace(/\/+$/, "");
}

async function json<T>(path: string): Promise<T> {
  const b = await base();
  const rel = path.startsWith("/") ? path : `/${path}`;
  const url = `${b}${rel}`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} @ ${url}`);
  return res.json() as Promise<T>;
}

// 👇 poprawione endpointy – już bez dodatkowego "/api" w argumencie
export const getCategories = () => json<Category[]>("/api/categories");
export const getBrands = () => json<Brand[]>("/api/brands");
export const getRandomRecommendations = (limit = 6) =>
  json<Product[]>(`/api/products/recommendations?limit=${limit}`);
