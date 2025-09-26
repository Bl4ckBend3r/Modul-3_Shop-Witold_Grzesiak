import map from "../../cloudinary-map.json";

const CLD: Record<string, string> = (map as any[]).reduce((acc, item) => {
  if (item.filename && item.secure_url) {
    acc[item.filename.toLowerCase()] = item.secure_url;
  }
  return acc;
}, {} as Record<string, string>);

export function cdn(src?: string | null): string | null {
  if (!src) return null;

  if (/^https?:\/\//i.test(src)) return src;

  const file = src.split("/").pop()!.toLowerCase();
  const hit = CLD[file];

  return hit ?? null;
}
