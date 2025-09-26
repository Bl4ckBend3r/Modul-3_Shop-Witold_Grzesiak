"use client";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export type Crumb = { label: string; href: string };
type Mode = "history" | "path";

const KEY = "breadcrumbHistory";
const HOME: Crumb = { label: "Home", href: "/" };

function readHistory(): Crumb[] {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Crumb[]) : [];
  } catch {
    return [];
  }
}
function writeHistory(items: Crumb[]) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(items));
  } catch {}
}

/** API dla stron/komponentów: zarejestruj ładną etykietę dla bieżącej ścieżki */
export function useRegisterBreadcrumb(label: string, href?: string) {
  const pathname = usePathname();
  const saved = useRef(false);

  useEffect(() => {
    if (saved.current) return;
    const link = href ?? pathname ?? "/";
    const items = readHistory();
    const without = items.filter((c) => c.href !== link);
    const next = [...without, { label, href: link }].slice(-12); // max 12 pozycji
    writeHistory(next);
    saved.current = true;
  }, [label, href, pathname]);
}

/** Generowanie okruszków z aktualnej ścieżki (fallback, gdy nie używasz historii) */
function buildFromPath(pathname: string | null): Crumb[] {
  if (!pathname) return [HOME];
  const parts = pathname.split("?")[0].split("/").filter(Boolean);
  const items: Crumb[] = [HOME];
  let acc = "";
  for (const p of parts) {
    acc += `/${p}`;
    const pretty =
      p.replace(/[-_]/g, " ")
        .replace(/\b\w/g, (m) => m.toUpperCase()) || "…";
    items.push({ label: pretty, href: acc });
  }
  return items;
}

function ellipsize(items: Crumb[], max = 5): Crumb[] {
  if (items.length <= max) return items;
  // Zostaw: Home, 2 z końca, bieżący (ostatni) — wstaw "…"
  const first = items[0];
  const lastTwo = items.slice(-2);
  return [first, { label: "…", href: items.slice(0, -2).at(-1)?.href || first.href }, ...lastTwo];
}

export default function Breadcrumb({
  items,
  mode = "history",
  maxItems = 5,
  className,
}: {
  items?: Crumb[];
  /** 'history' (domyślne) – z historii nawigacji; 'path' – z aktualnej ścieżki */
  mode?: Mode;
  /** maksymalna liczba widocznych elementów (reszta zwinięta do „…”) */
  maxItems?: number;
  className?: string;
}) {
  const pathname = usePathname();
  const [history, setHistory] = useState<Crumb[]>([]);

  // czytać historię tylko w trybie 'history'
  useEffect(() => {
    if (mode !== "history") return;
    setHistory(readHistory());
  }, [mode, pathname]);

  const autoItems = useMemo(() => {
    if (items?.length) return items;
    if (mode === "history") {
      const arr = history.length ? history : buildFromPath(pathname);
      // upewnij się, że ostatni = bieżąca ścieżka (bez duplikatu)
      const dedup = arr
        .filter((c, i, a) => a.findIndex((x) => x.href === c.href) === i)
        .filter(Boolean);
      return dedup;
    }
    return buildFromPath(pathname);
  }, [items, mode, history, pathname]);

  const view = ellipsize(autoItems, maxItems);

  if (!view.length) return null;

  return (
    <nav aria-label="Breadcrumb" className={className ?? "text-sm text-neutral-400"}>
      <ol className="flex items-center gap-2">
        {view.map((c, i) => {
          const isLast = i === view.length - 1;
          return (
            <li key={`${c.href}-${i}`} className="flex items-center gap-2">
              {isLast ? (
                <span className="text-white">{c.label}</span>
              ) : (
                <Link href={c.href} className="hover:text-white transition-colors">
                  {c.label}
                </Link>
              )}
              {!isLast && <span className="text-neutral-600">&gt;</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
