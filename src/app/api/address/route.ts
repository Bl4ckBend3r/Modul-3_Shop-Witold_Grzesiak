// app/api/address/route.ts
import { NextRequest } from "next/server";

const API = process.env.BACKEND_URL ?? "http://localhost:4000"; // <- ustaw to u siebie

export async function POST(req: NextRequest) {
  try {
    // przekazujemy dokładnie to co wysłał klient
    const body = await req.text();

    const r = await fetch(`${API}/address`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body,
      cache: "no-store",
    });

    // jeśli backend zwrócił JSON – przekaż dalej;
    // jeśli 204/empty – zwróć prosty {ok:true}
    const ct = r.headers.get("content-type") || "";
    if (r.ok) {
      if (ct.includes("application/json")) {
        const data = await r.json();
        return Response.json(data, { status: r.status });
      }
      return Response.json({ ok: true }, { status: r.status });
    }

    // błąd z backendu – spróbuj odczytać JSON {error}, w przeciwnym razie krótki komunikat
    let message = r.statusText || "Save failed";
    if (ct.includes("application/json")) {
      const err = await r.json().catch(() => null);
      if (err?.error || err?.message) message = err.error || err.message;
    }
    return Response.json({ error: message }, { status: r.status });
  } catch (e: any) {
    return Response.json({ error: e?.message ?? "Save failed" }, { status: 500 });
  }
}
