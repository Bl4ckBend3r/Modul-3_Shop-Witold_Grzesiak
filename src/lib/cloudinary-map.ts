import mapJson from '../../cloudinary-map.json';

export const cloudMap = mapJson as Record<string, string>;


export function cld(src?: string | null): string | null {
  if (!src) return null;
  if (cloudMap[src]) return cloudMap[src];

  // Pozwala w danych podawać np. "aoc-24g2e" zamiast "aoc-24g2e.png"
  const candidates = [`${src}.png`, `${src}.jpg`, `${src}.jpeg`, `${src}.webp`];
  for (const c of candidates) if (cloudMap[c]) return cloudMap[c];

  return null;
}
export function cdn(name: string): string | undefined {

  return (mapJson as Record<string, string>)[name];
}


export default mapJson as Record<string, string>;
