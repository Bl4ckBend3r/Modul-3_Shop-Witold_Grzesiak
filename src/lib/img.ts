import MAP from "./cloudinary-map";

export function getImgSrc(key?: string | null): string {
  if (!key) return "/placeholder.png";
  // próbuj po pełnej nazwie pliku (np. "viper-mini.png"), a jeśli podajesz bez rozszerzenia – po "public_id"
  return MAP[key] || MAP[`${key}.png`] || MAP[`${key}.jpg`] || "/placeholder.png";
}
