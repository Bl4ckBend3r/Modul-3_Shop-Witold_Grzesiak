// src/lib/cloudinary.ts
import map from "../../cloudinary-map.json";

const CLD: Record<string, string> = (map as any[]).reduce((acc, item) => {
  if (item.filename && item.secure_url) {
    acc[item.filename.toLowerCase()] = item.secure_url;
  }
  return acc;
}, {} as Record<string, string>);

const isHttp = (s: string) => /^https?:\/\//i.test(s);

export function cdn(src?: string | null): string | null {
  if (!src) return null;
  if (isHttp(src)) return src;

  const file = src.split("/").pop()!.toLowerCase();
  return CLD[file] ?? null;
}

export { CLD };
