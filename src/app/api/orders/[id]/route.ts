import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; 

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  console.log(">>> API /orders called with id:", id);

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: {
            include: {
              category: true,
              brand: true,
            },
          },
        },
      },
    },
  });

  console.log(">>> Prisma result:", order);

  if (!order) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(order);
}
