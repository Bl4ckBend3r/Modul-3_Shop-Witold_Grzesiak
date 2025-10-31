// app/api/brands/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; 

export async function GET() {
  const brands = await prisma.brand.findMany({
    select: { id: true, name: true, slug: true, imageUrl: true },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(brands);
}
