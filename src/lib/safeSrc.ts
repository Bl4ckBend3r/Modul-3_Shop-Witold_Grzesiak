export function safeSrc(url?: string | null): string | undefined {
  if (!url) return undefined;
  const u = url.trim();
  return u.length ? u : undefined; 
}
