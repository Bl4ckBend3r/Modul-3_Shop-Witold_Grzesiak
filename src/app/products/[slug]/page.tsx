import { notFound } from "next/navigation";
import { headers } from "next/headers";
import ProductDetailClient from "@/app/products/_parts/ProductDetailClient";
import Breadcrumb from "@/ui/Breadcrumb";

// jeżeli chcesz zawsze SSR i brak cache
export const dynamic = "force-dynamic";

async function baseUrl() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto =
    h.get("x-forwarded-proto") ?? (process.env.VERCEL ? "https" : "http");
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
    product: any;
    recommendations: any[];
  };
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const data = await getData(params.slug);
  if (!data?.product) notFound();

  const { product, recommendations } = data;

  return (
<main className="w-full overflow-x-clip bg-[#1A1A1A] text-white">
      <div className="w-full flex justify-center">
        <div className="w-full max-w-[1440px] px-4 md:px-8 lg:px-10 flex flex-col gap-8 mx-auto">
          {/* Breadcrumb nad sekcją produktu */}
          <Breadcrumb
            items={[
              { label: "Products", href: "/products" },
              { label: product.name, href: `/products/${product.slug}` },
            ]}
          />

          {/* Główna sekcja produktu */}
          <ProductDetailClient product={product} />
        </div>
      </div>
    </main>
  );
}
