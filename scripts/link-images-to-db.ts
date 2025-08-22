// scripts/link-images-to-db.ts
import "dotenv/config";
import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type CloudRow = {
  type: "products" | "brand" | "payment";
  filename: string;
  basenameSlug: string; 
  public_id: string;
  secure_url: string;
};

function readMap(): CloudRow[] {
  const p = path.resolve(process.cwd(), "scripts/.cache/cloudinary-map.json");
  if (!fs.existsSync(p)) {
    throw new Error(
      "Nie znaleziono cloudinary-map.json – uruchom najpierw upload.cjs"
    );
  }
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

async function linkProducts(rows: CloudRow[]) {
  let ok = 0,
    miss = 0;
  for (const r of rows.filter((x) => x.type === "products")) {
    const slug = r.basenameSlug;
    const updated = await prisma.product.updateMany({
      where: { slug },
      data: { imageUrl: r.secure_url },
    });
    if (updated.count > 0) ok += updated.count;
    else {
      miss++;
      console.warn(
        "⚠️  Nie znaleziono Product.slug =",
        slug,
        "dla",
        r.filename
      );
    }
  }
  console.log(`Products: zapisano ${ok}, pominięto ${miss}`);
}

async function linkBrands(rows: CloudRow[]) {
  let ok = 0,
    miss = 0;
  for (const r of rows.filter((x) => x.type === "brand")) {
    const slug = r.basenameSlug;
    const updated = await prisma.brand.updateMany({
      where: { slug },
      data: { imageUrl: r.secure_url },
    });
    if (updated.count > 0) ok += updated.count;
    else {
      miss++;
      console.warn("⚠️  Nie znaleziono Brand.slug =", slug, "dla", r.filename);
    }
  }
  console.log(`Brands: zapisano ${ok}, pominięto ${miss}`);
}

async function main() {
  const rows = readMap();
  await linkProducts(rows);
  await linkBrands(rows);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
