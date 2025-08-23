// app/api/products/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Helpers */
function toNumber(v: unknown) {
  if (typeof v === "number") return v;
  const n = (v as any)?.toNumber?.() ?? Number(v);
  return Number.isFinite(n) ? n : NaN;
}

// Minimalny, „przenośny” kształt sortowania – wystarczy dla naszych pól
type OrderBy = { price?: "asc" | "desc"; name?: "asc" | "desc"; createdAt?: "asc" | "desc" } | Array<{ [k: string]: "asc" | "desc" }>;

function normalizeSort(raw: string | null | undefined): string {
  const s = (raw ?? "newest").toLowerCase();
  switch (s) {
    case "price_asc":  return "cheapest";
    case "price-desc":
    case "price_desc": return "expensive";
    case "name_asc":   return "name_asc";
    case "name-desc":
    case "name_desc":  return "name_desc";
    case "oldest":     return "oldest";
    case "newest":     return "newest";
    default:           return "newest";
  }
}

function sortToOrderBy(norm: string): OrderBy {
  switch (norm) {
    case "cheapest":  return { price: "asc" };
    case "expensive": return { price: "desc" };
    case "name_asc":  return { name: "asc" };
    case "name_desc": return { name: "desc" };
    case "oldest":    return { createdAt: "asc" };
    case "newest":
    default:          return { createdAt: "desc" };
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  // --- filtry ---
  const category = searchParams.get("category")?.trim() || undefined;
  const priceMinParam = searchParams.get("priceMin");
  const priceMaxParam = searchParams.get("priceMax");
  const priceMin = priceMinParam ? Number(priceMinParam) : undefined;
  const priceMax = priceMaxParam ? Number(priceMaxParam) : undefined;

  if (priceMinParam && Number.isNaN(priceMin)) {
    return NextResponse.json({ error: "Invalid priceMin" }, { status: 400 });
  }
  if (priceMaxParam && Number.isNaN(priceMax)) {
    return NextResponse.json({ error: "Invalid priceMax" }, { status: 400 });
  }

  // --- sort ---
  const sortNorm = normalizeSort(searchParams.get("sort"));
  const orderBy: OrderBy = sortToOrderBy(sortNorm);

  // --- paginacja ---
  const perPage = Math.min(Math.max(Number(searchParams.get("perPage") ?? 12), 1), 60);
  const page = Math.max(Number(searchParams.get("page") ?? 1), 1);
  const offsetParam = searchParams.get("offset");
  const offset = offsetParam !== null ? Math.max(Number(offsetParam), 0) : (page - 1) * perPage;

  // --- where --- (używamy `any`, bo różne wersje Prisma mają różne kształty)
  const where: any = {
    AND: [
      category ? { category: { slug: category } } : {},
      priceMin !== undefined ? { price: { gte: priceMin } } : {},
      priceMax !== undefined ? { price: { lte: priceMax } } : {},
    ],
  };

  try {
    const [total, rows] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        orderBy: orderBy as any, // rzutowanie usuwa konflikt z `never`
        take: perPage,
        skip: offset,
        select: {
          id: true,
          slug: true,
          name: true,
          price: true,
          imageUrl: true,
          category: { select: { id: true, name: true, slug: true } },
        },
      }),
    ]);

    const items = rows.map((r) => ({
      id: String(r.id),
      slug: r.slug,
      name: r.name,
      price: toNumber(r.price),
      imageUrl: r.imageUrl && r.imageUrl.trim() ? r.imageUrl : null,
      category: r.category
        ? { id: String(r.category.id), name: r.category.name, slug: r.category.slug }
        : null,
    }));

    const totalPages = Math.max(Math.ceil(total / perPage), 1);
    const currentPage = offsetParam !== null ? Math.floor(offset / perPage) + 1 : page;

    return NextResponse.json(
      {
        items,
        meta: {
          total,
          perPage,
          page: currentPage,
          totalPages,
          hasPrev: currentPage > 1,
          hasNext: currentPage < totalPages,
          sort: sortNorm,
        },
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("[/api/products] DB error:", err);
    return NextResponse.json({ error: err?.message || "DB error" }, { status: 500 });
  }
}
