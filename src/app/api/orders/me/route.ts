import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; 

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    where: { user: { email: session.user.email } },
    orderBy: { createdAt: "desc" },
    take: 10,
    include: {
      items: { include: { product: true } },
    },
  });

  const data = orders.map((o) => ({
    id: o.id,
    date: o.createdAt.toISOString(),
    number: o.id, 
    products: o.items.map((it) => it.product.name),
  }));

  return NextResponse.json(data);
}
