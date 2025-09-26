import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const RegisterDTO = z
  .object({
    email: z.string().email(),
    phone: z.string().optional().nullable(),
    password: z
      .string()
      .min(8)
      .regex(/[A-Z]/, "Needs uppercase")
      .regex(/[a-z]/, "Needs lowercase")
      .regex(/[0-9]/, "Needs number"),
    confirm: z.string(),
    agree: z.boolean(),
  })
  .refine((d) => d.password === d.confirm, {
    path: ["confirm"],
    message: "Passwords do not match.",
  })
  .refine((d) => d.agree, {
    path: ["agree"],
    message: "Please accept the terms.",
  });

export async function POST(req: Request) {
  try {
    const json = await req.json();

    if (typeof json.phone === "string") {
      const digits = json.phone.replace(/[^\d]/g, "");
      json.phone = digits.length ? digits : null;
    }

    const parsed = RegisterDTO.safeParse(json);
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      return NextResponse.json(
        { ok: false, field: issue.path[0], message: issue.message },
        { status: 400 }
      );
    }

    const { email, phone, password } = parsed.data;

    // sprawdź email
    const emailExists = await prisma.user.findUnique({ where: { email } });
    if (emailExists) {
      return NextResponse.json(
        { ok: false, field: "email", message: "Email is already in use." },
        { status: 409 }
      );
    }

    // sprawdź telefon
    if (phone) {
      const phoneExists = await prisma.user.findFirst({ where: { phone } });
      if (phoneExists) {
        return NextResponse.json(
          { ok: false, field: "phone", message: "Phone is already in use." },
          { status: 409 }
        );
      }
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName: "Guest",
        lastName: "",
        ...(phone ? { phone } : {}),
      },
      select: { id: true, email: true },
    });

    return NextResponse.json({ ok: true, user }, { status: 201 });
  } catch (e) {
    console.error("❌ Register error:", e);
    return NextResponse.json(
      { ok: false, message: "Unexpected error." },
      { status: 500 }
    );
  }
}
