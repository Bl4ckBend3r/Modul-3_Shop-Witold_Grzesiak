// src/lib/cloudinary.ts
import map from '../../cloudinary-map.json';

const CLD = map as Record<string, string>;

const isHttp = (s: string) => /^https?:\/\//i.test(s);

export function toCloudinary(src?: string | null): string | null {
  if (!src) return null;
  if (isHttp(src)) return src;


  const clean = src.split(/[?#]/)[0];

  const base = clean.substring(clean.lastIndexOf('/') + 1).toLowerCase();

  return CLD[base] ?? src;
}

export function toCloudinaryImages<T extends { url: string }>(arr?: T[] | null): T[] {
  if (!arr) return [];
  return arr.map((it) => ({
    ...it,
    url: toCloudinary(it.url) ?? it.url,
  }));
}
