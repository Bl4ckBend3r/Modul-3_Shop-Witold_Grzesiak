import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function toNumber(v: unknown) {
  if (typeof v === "number") return v;
  const n = (v as any)?.toNumber?.() ?? Number(v);
  return Number.isFinite(n) ? n : NaN;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") ?? undefined;

  try {
    const rows = await prisma.product.findMany({
      where: category ? { category: { slug: category } } : undefined,
      include: {
        category: { select: { id: true, name: true, slug: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    // Normalizacja cennika (Decimal/string -> number), by UI nie wywalał się na toFixed
    const data = rows.map((r) => ({
      ...r,
      price: toNumber((r as any).price),
    }));

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("[/api/products] DB error:", err);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}
