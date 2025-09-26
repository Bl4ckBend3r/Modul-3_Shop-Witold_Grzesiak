/* scripts/upload.cjs */
const fs = require("fs");
const path = require("path");
const { v2: cloudinary } = require("cloudinary");

require("dotenv").config({ path: path.resolve(process.cwd(), ".env") });

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME?.trim();
const API_KEY = process.env.CLOUDINARY_API_KEY?.trim();
const API_SECRET = process.env.CLOUDINARY_API_SECRET?.trim();

if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
  console.error("Brak CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET w .env.local");
  process.exit(1);
}

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
  secure: true,
});

const IMAGES_DIR = path.resolve(process.cwd(), "images");
const OUT_MAP = path.resolve(
  process.cwd(),
  "../cloudinary-map.json"
);
const ALLOWED = new Set(["products", "brand", "payment"]);
const exts = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"]);

const slug = (name) =>
  name
    .normalize("NFKD")
    .replace(/[^\w\s.-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/\./g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

async function main() {
  try {
    const pong = await cloudinary.api.ping();
    console.log("✅ Admin API ping:", pong.status);
  } catch (e) {
    console.error("❌ Admin API ping FAIL:", e?.http_code, e?.message || e);
    process.exit(1);
  }

  if (!fs.existsSync(IMAGES_DIR)) {
    console.error("❌ Nie znaleziono katalogu obrazów:", IMAGES_DIR);
    process.exit(1);
  }

  // zbierz pliki z dozwolonych podfolderów
  const entries = [];
  for (const type of fs.readdirSync(IMAGES_DIR, { withFileTypes: true })) {
    if (!type.isDirectory()) continue;
    const folder = type.name;
    if (!ALLOWED.has(folder)) continue;

    const folderPath = path.join(IMAGES_DIR, folder);
    for (const f of fs.readdirSync(folderPath, { withFileTypes: true })) {
      if (!f.isFile()) continue;
      const filePath = path.join(folderPath, f.name);
      if (!exts.has(path.extname(filePath).toLowerCase())) continue;
      entries.push({ type: folder, filePath, filename: f.name });
    }
  }

  if (!entries.length) {
    console.error("❌ Brak plików w images/{products,brand,payment}");
    process.exit(1);
  }

  console.log(`▶️  Upload ${entries.length} plików z ${IMAGES_DIR} ...`);

  const results = [];
  let ok = 0,
    fail = 0;

  for (const { type, filePath, filename } of entries) {
    const baseNoExt = path.basename(filename, path.extname(filename));
    // Dla brand: często nazwa w stylu "AOC Logo" → usuń "logo"
    const basenameSlug = slug(
      baseNoExt
        .replace(/logo$/i, "")
        .replace(/-logo$/i, "")
        .trim()
    );
    const public_id = basenameSlug;

    try {
      const r = await cloudinary.uploader.upload(filePath, {
        folder: type, // 'products' | 'brand' | 'payment'
        public_id,
        use_filename: true,
        unique_filename: false,
        overwrite: true,
        resource_type: "image",
      });
      console.log("✅", `${type}/${filename}`, "→", r.secure_url);
      const cleanUrl = r.secure_url.replace(/\/v\d+\//, "/");

results.push({
  type,
  filename,
  basenameSlug,
  public_id: `${type}/${public_id}`,
  secure_url: cleanUrl, // zawsze bez wersji
});

      ok++;
    } catch (e) {
      console.error("❌", `${type}/${filename}`, "=>", e?.message || e);
      fail++;
    }
  }

  fs.writeFileSync(OUT_MAP, JSON.stringify(results, null, 2), "utf8");
  console.log(`\n🗺️  Zapisano mapę URL-i: ${OUT_MAP}`);
  console.log(`📦 Sukces: ${ok}  ❗ Błędy: ${fail}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
