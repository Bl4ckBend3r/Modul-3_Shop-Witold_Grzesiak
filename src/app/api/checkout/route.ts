// src/app/api/checkout/route.ts
import { NextResponse } from "next/server";
import { PrismaClient, Prisma, OrderStatus } from "@prisma/client";

import { cookies } from "next/headers";

export const prisma = new PrismaClient();
export const dynamic = "force-dynamic";

// GET — zwraca konfigurację checkout (na razie mock, do podmiany na dane z DB)
export async function GET() {
  const payload = {
    address: {
      line: "Bangalau Road No 23, RT 4/RW 6, Kinajaya",
      country: "Indonesia",
      province: "Jakarta",
      city: "Jakarta",
      postal: "12819",
      isDefault: true,
    },
    shipping: {
      method: "NexusHub Courier",
      price: 6,
      insuranceDefault: true,
      insurancePrice: 5,
    },
    protection: {
      enabledByDefault: false,
      price: 1,
      description:
        "Protect your products from damage and defects, valid for 6 months.",
    },
    fees: { service: 0.5 },
    payments: { applePay: true },
  };

  return NextResponse.json(payload);
}

// POST — tworzy zamówienie na podstawie koszyka
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const store = cookies();

    const userId = body.userId ?? null;
    let cart;

    if (userId) {
      // 🔹 spróbuj znaleźć koszyk przypisany do usera
      cart = await prisma.cart.findFirst({
        where: { userId, status: "OPEN" },
        include: { items: { include: { product: true } } },
      });
    } else {
      // 🔹 fallback: koszyk gościa
      const guestId = store.get("guestId")?.value;
      if (!guestId) {
        return NextResponse.json(
          { error: "No guest cart found" },
          { status: 401 }
        );
      }

      cart = await prisma.cart.findFirst({
        where: { guestId, status: "OPEN" },
        include: { items: { include: { product: true } } },
      });
    }

    if (!cart) {
      return NextResponse.json({ error: "No open cart" }, { status: 404 });
    }

    if (cart.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // 🔹 oblicz sumę produktów
    const totalAmount = cart.items.reduce(
      (sum, it) => sum + it.qty * Number(it.product.price),
      0
    );

    // 🔹 utwórz zamówienie
    const order = await prisma.order.create({
      data: {
        status: OrderStatus.PENDING,
        totalAmount: new Prisma.Decimal(totalAmount),

        shipName: body.address?.line ?? null,
        shipLine1: body.address?.line ?? null,
        shipCity: body.address?.city ?? null,
        shipPostal: body.address?.postal ?? null,
        shipCountry: body.address?.country ?? null,

        items: {
          create: cart.items.map((it) => ({
            productId: it.productId,
            quantity: it.qty,
            priceAtPurchase: new Prisma.Decimal(it.product.price),
          })),
        },

        // 🔹 jeżeli user zalogowany → przypisz zamówienie do usera
        ...(userId ? { user: { connect: { id: userId } } } : {}),
      },
      include: { items: true },
    });

    // 🔹 zamknij koszyk
    await prisma.cart.update({
      where: { id: cart.id },
      data: { status: "ORDERED" },
    });

    return NextResponse.json({ ok: true, order });
  } catch (err: any) {
    console.error("Error in /api/checkout:", err);
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 }
    );
  }
}

