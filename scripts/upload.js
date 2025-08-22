/* scripts/upload.cjs */
require("dotenv/config");
const { v2: cloudinary } = require("cloudinary");
const fs = require("fs");
const path = require("path");

cloudinary.config({ secure: true }); // pobierze z CLOUDINARY_URL

const LOCAL_DIR = path.resolve(process.cwd(), "images"); // <- tu masz swoje PNG
const OUT_MAP = path.resolve(process.cwd(), "cloudinary-map.json");

// akceptowane rozszerzenia
const exts = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"]);

// proste "slugify" pod public_id
const slug = (name) =>
  name
    .normalize("NFKD")
    .replace(/[^\w\s.-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/\./g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

if (!fs.existsSync(LOCAL_DIR)) {
  console.error("Nie znaleziono folderu:", LOCAL_DIR);
  process.exit(1);
}

(async () => {
  const files = fs
    .readdirSync(LOCAL_DIR, { withFileTypes: true })
    .filter((e) => e.isFile())
    .map((e) => path.join(LOCAL_DIR, e.name))
    .filter((p) => exts.has(path.extname(p).toLowerCase()));

  if (files.length === 0) {
    console.error("Brak plików graficznych w", LOCAL_DIR);
    process.exit(1);
  }

  const results = {};

  for (const fp of files) {
    const base = path.basename(fp);
    const publicId = slug(base.replace(path.extname(base), "")); // np. "aoc-24g2e"
    try {
      const res = await cloudinary.uploader.upload(fp, {
        folder: "products",
        public_id: publicId,
        use_filename: true,
        unique_filename: false,
        overwrite: true,
        resource_type: "image",
      });
      console.log("OK:", base, "→", res.secure_url);
      results[base] = res.secure_url;
    } catch (err) {
      console.error("Upload error:", base, "=>", err.message || err);
    }
  }

  fs.writeFileSync(OUT_MAP, JSON.stringify(results, null, 2), "utf8");
  console.log("\nMapa URL-i zapisana do:", OUT_MAP);
})();
