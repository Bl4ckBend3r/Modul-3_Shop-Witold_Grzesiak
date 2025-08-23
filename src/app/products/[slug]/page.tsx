import { notFound } from "next/navigation";
import { headers } from "next/headers";
import ProductDetailClient from "@/app/products/_parts/ProductDetailClient";
import Breadcrumb from "@/ui/Breadcrumb";

// jeżeli chcesz zawsze SSR i brak cache
export const dynamic = "force-dynamic";

async function baseUrl() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? (process.env.VERCEL ? "https" : "http");
  if (!host) throw new Error("Missing host header");
  return `${proto}://${host}`;
}

async function getData(slug: string) {
  const base = await baseUrl();
  const res = await fetch(`${base}/api/products/${encodeURIComponent(slug)}`, {
    cache: "no-store",
    next: { revalidate: 0 },
  });
  if (!res.ok) return null;
  return (await res.json()) as {
    product: any;          // możesz tu podstawić swój dokładny typ (z Prisma)
    recommendations: any[]; // jw.
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const data = await getData(params.slug);
  if (!data?.product) notFound();

  const { product, recommendations } = data;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <Breadcrumb
        items={[
          { label: "Product", href: "/products" },
          { label: product.name, href: `/products/${product.slug}` },
        ]}
      />
      <div className="mt-4">
        <ProductDetailClient product={product} recommendations={recommendations} />
      </div>
    </div>
  );
}
