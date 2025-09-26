// src/lib/cloudinary-map.ts
import mapJson from "../../cloudinary-map.json";

// Budujemy słownik: filename -> secure_url
export const cloudMap: Record<string, string> = (mapJson as any[]).reduce(
  (acc, item) => {
    if (item.filename && item.secure_url) {
      acc[item.filename.toLowerCase()] = item.secure_url;
    }
    return acc;
  },
  {} as Record<string, string>
);

export function cld(src?: string | null): string | null {
  if (!src) return null;

  if (/^https?:\/\//i.test(src)) return src;

  // bezpośrednie trafienie
  if (cloudMap[src.toLowerCase()]) return cloudMap[src.toLowerCase()];

  // sprawdzamy z rozszerzeniami
  const candidates = [
    `${src}.png`,
    `${src}.jpg`,
    `${src}.jpeg`,
    `${src}.webp`,
  ];
  for (const c of candidates) {
    const url = cloudMap[c.toLowerCase()];
    if (url) return url;
  }

  return null;
}

export function cdn(name: string): string | undefined {
  return cloudMap[name.toLowerCase()];
}

export default cloudMap;
