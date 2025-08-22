
import map from '../../cloudinary-map.json'; 

export function cdn(src?: string | null): string | null {
  if (!src) return null;

  
  if (/^https?:\/\//i.test(src)) return src;

  const file = src.split('/').pop()!;
  const hit = (map as Record<string, string>)[file];

  return hit ?? null; 
}
