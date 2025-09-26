import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { userId, productId } = await req.json();
    const store = await cookies();

    if (!productId) {
      return NextResponse.json(
        { error: "Missing productId" },
        { status: 400 }
      );
    }

    let cart = null;

    /** ================= USER ================= */
    if (userId) {
      cart = await prisma.cart.findFirst({
        where: { userId, status: "OPEN" },
      });
    }

    /** ================= GUEST ================= */
    if (!cart) {
      const guestId = store.get("guestId")?.value;
      if (guestId) {
        cart = await prisma.cart.findFirst({
          where: { guestId, status: "OPEN" },
        });
      }
    }

    if (!cart) {
      return NextResponse.json(
        { error: "Cart not found" },
        { status: 404 }
      );
    }

    // 2. Znajdź item w koszyku
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    if (!existingItem) {
      return NextResponse.json(
        { error: "Item not found in cart" },
        { status: 404 }
      );
    }

    let updatedItem = null;

    if (existingItem.qty > 1) {
      updatedItem = await prisma.cartItem.update({
        where: { cartId_productId: { cartId: cart.id, productId } },
        data: { qty: { decrement: 1 }, updatedAt: new Date() },
        include: { product: true },
      });
    } else {
      await prisma.cartItem.delete({
        where: { cartId_productId: { cartId: cart.id, productId } },
      });
    }

    return NextResponse.json(
      {
        message:
          existingItem.qty > 1
            ? "Decreased item quantity"
            : "Removed item from cart",
        cartId: cart.id,
        item: updatedItem,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Error in /api/cart/decrease:", err);
    return NextResponse.json(
      { error: "Failed to decrease item quantity" },
      { status: 500 }
    );
  }
}
