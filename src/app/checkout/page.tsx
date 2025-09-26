import { headers } from "next/headers";
import CheckoutClient from "@/ui/CheckoutClient";

export const dynamic = "force-dynamic";

async function getBase() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? (process.env.VERCEL ? "https" : "http");
  if (!host) throw new Error("Brak nagłówka host – nie można zbudować URL");
  return `${proto}://${host}`;
}

export default async function CheckoutPage() {
  const base = await getBase();
  const res = await fetch(`${base}/api/checkout`, { cache: "no-store" });
  if (!res.ok) throw new Error("Nie udało się pobrać konfiguracji checkout");
  const config = await res.json();

  return <CheckoutClient config={config} />;
}
