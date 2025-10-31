import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { userId, productId, qty = 1 } = await req.json();
    console.log("=== /api/cart/add ===", { userId, productId, qty });

    if (!productId) {
      return NextResponse.json({ error: "Missing productId" }, { status: 400 });
    }

    // sprawdź czy produkt istnieje
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return NextResponse.json({ error: "Invalid productId" }, { status: 400 });
    }

    const store = await cookies();
    let cart;

    /** ================= USER ================= */
    if (userId) {
      const userExists = await prisma.user.findUnique({ where: { id: userId } });
      if (userExists) {
        cart = await prisma.cart.findFirst({
          where: { userId, status: "OPEN" },
        });
        if (!cart) {
          cart = await prisma.cart.create({
            data: { userId, status: "OPEN" },
          });
        }
      } else {
        console.warn(`User ${userId} not found, fallback to guest`);
      }
    }

    /** ================= GUEST ================= */
    if (!cart) {
      let guestId = store.get("guestId")?.value;
      let newGuestId = false;

      if (!guestId) {
        guestId = crypto.randomUUID();
        newGuestId = true;
      }

      cart = await prisma.cart.upsert({
        where: { guestId },
        update: { status: "OPEN", updatedAt: new Date() },
        create: { guestId, status: "OPEN" },
      });

      if (newGuestId) {
        const res = NextResponse.json({ message: "New guest cart created", cartId: cart.id });
        res.cookies.set("guestId", guestId, {
          httpOnly: true,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          path: "/",
          maxAge: 60 * 60 * 24 * 30,
        });
        return res; // 👈 ważne: reszta kodu nie wykona się
      }
    }

    /** ================= ITEM ================= */
    const item = await prisma.cartItem.upsert({
      where: { cartId_productId: { cartId: cart.id, productId } },
      update: { qty: { increment: qty } },
      create: { cartId: cart.id, productId, qty },
      include: { product: true },
    });

    return NextResponse.json(
      { message: "Product added to cart", cartId: cart.id, item },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Error in /api/cart/add:", err);
    return NextResponse.json(
      { error: "Failed to add item to cart", details: String(err) },
      { status: 500 }
    );
  }
}
