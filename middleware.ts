import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { withAuth } from "next-auth/middleware";

const PUBLIC_FILE = /\.(.*)$/;

async function verifyToken(token: string | undefined) {
  if (!token) return false;
  try {
    const secret = new TextEncoder().encode(process.env.AUTH_SECRET);
    await jwtVerify(token, secret); // poprawność + exp
    return true;
  } catch {
    return false;
  }
}

export default withAuth({
  pages: { signIn: "/auth/login" },
});


export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Publiczne ścieżki (nie wymagają logowania)
  const isPublic =
    pathname.startsWith("/auth/login") ||
    pathname.startsWith("/auth/register") ||
    pathname.startsWith("/api/auth/") || // API do logowania/rejestracji
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon") ||
    PUBLIC_FILE.test(pathname);

  if (isPublic) return NextResponse.next();

  // Sprawdź cookie `session`
  const token = req.cookies.get("session")?.value;
  const ok = await verifyToken(token);
  if (ok) return NextResponse.next();

  // Redirect do logowania z powrotem na stronę docelową
  const url = req.nextUrl.clone();
  url.pathname = "/auth/login";
  // zachowaj where-to-go po zalogowaniu
  const from = pathname + (search || "");
  url.searchParams.set("from", from);
  return NextResponse.redirect(url);
}

// Wykluczenia dla matchera (assets, publiczne auth, api/auth)
export const config = {
  matcher: [
    // "/((?!_next/static|_next/image|favicon.ico|auth/login|auth/register|api/auth/.*).*)",
        "/((?!_next/static|_next/image|favicon.ico|auth/login|auth/register|api/auth/.*).*)",

  ],
};
