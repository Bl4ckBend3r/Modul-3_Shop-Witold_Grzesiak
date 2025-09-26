import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { getServerSession } from "next-auth";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const store = await cookies();
  const guestId = store.get("guestId")?.value;

  let cart = null;

  if (userId) {
    cart = await prisma.cart.findFirst({
      where: { userId, status: "OPEN" },
      include: { items: { include: { product: true } } },
    });
  }

  if (!cart && guestId) {
    cart = await prisma.cart.findFirst({
      where: { guestId, status: "OPEN" },
      include: { items: { include: { product: true } } },
    });
  }

  return NextResponse.json(cart ?? { items: [] });
}

