import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const limit = Number(url.searchParams.get("limit") ?? 6);

  const rows = await prisma.product.findMany({
    include: { category: { select: { name: true, slug: true, id: true } } },
    take: 6,
  });
  const data = rows.map((r) => ({
    ...r,
    price: Number(r.price),
  }));

  return NextResponse.json(rows);
}
