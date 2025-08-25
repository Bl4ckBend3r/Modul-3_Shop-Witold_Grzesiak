import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

export async function POST(req: Request) {
  try {
    const { identifier, password, remember } = await req.json();

    // Login po emailu albo telefonie (same cyfry)
    const byPhone = typeof identifier === "string" && identifier.replace(/[^\d]/g, "").length >= 10;
    const where = byPhone
      ? { phone: identifier.replace(/[^\d]/g, "") }
      : { email: String(identifier).trim().toLowerCase() };

    const user =
      (await prisma.user.findFirst({ where })) || // jeśli nie masz unikatowego phone
      null;

    if (!user) {
      return NextResponse.json({ ok: false, message: "Invalid credentials." }, { status: 401 });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return NextResponse.json({ ok: false, message: "Invalid credentials." }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.AUTH_SECRET);
    // 7 dni lub 1 dzień — zależnie od "remember"
    const exp = remember ? "7d" : "1d";

    const token = await new SignJWT({ sub: user.id })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(exp)
      .sign(secret);

    const res = NextResponse.json({ ok: true, user: { id: user.id, email: user.email } }, { status: 200 });
    res.cookies.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: remember ? 60 * 60 * 24 * 7 : 60 * 60 * 24,
    });
    return res;
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, message: "Unexpected error." }, { status: 500 });
  }
}
