// src/app/api/products/[slug]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

function getRandomDeliveryDate() {
  const now = new Date();
  const min = 1; // od jutra
  const max = 7; // do 7 dni
  const daysToAdd = Math.floor(Math.random() * (max - min + 1)) + min;
  const deliveryDate = new Date(now);
  deliveryDate.setDate(now.getDate() + daysToAdd);
  return deliveryDate.toISOString();
}

export async function GET(_req: NextRequest, context: any) {
  try {
    const slug = context.params.slug as string;

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        brand: true,
        category: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const recommendations = await prisma.product.findMany({
      where: { categoryId: product.categoryId, id: { not: product.id } },
      orderBy: { createdAt: "desc" },
      take: 12,
      include: { category: true, brand: true },
    });

    return NextResponse.json(
      {
        product: {
          ...product,
          deliveryDate: getRandomDeliveryDate(),
        },
        recommendations,
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (e) {
    console.error("[GET /api/products/[slug]]", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
