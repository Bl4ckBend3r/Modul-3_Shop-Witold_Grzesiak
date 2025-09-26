// scripts/cloudify-db.ts
import "dotenv/config";
import { PrismaClient } from "@prisma/client"; 
import map from "../cloudinary-map.json";

const prisma = new PrismaClient();

// budujemy mapę: basenameSlug -> secure_url
const CLD: Record<string, string> = (map as any[]).reduce((acc, item) => {
  if (item.basenameSlug && item.secure_url) {
    acc[item.basenameSlug.toLowerCase()] = item.secure_url;
  }
  return acc;
}, {} as Record<string, string>);

const toCld = (src: string) => {
  if (!src || /^https?:\/\//i.test(src)) return src;
  const clean = src.split(/[?#]/)[0];
  const base = clean.substring(clean.lastIndexOf("/") + 1).toLowerCase();
  return CLD[base] ?? src;
};

async function main() {
  const products = await prisma.product.findMany({ select: { id: true, imageUrl: true } });
  for (const p of products) {
    const next = toCld(p.imageUrl);
    if (next !== p.imageUrl) {
      await prisma.product.update({ where: { id: p.id }, data: { imageUrl: next } });
    }
  }

  const images = await prisma.productImage.findMany({ select: { id: true, url: true } });
  for (const img of images) {
    const next = toCld(img.url);
    if (next !== img.url) {
      await prisma.productImage.update({ where: { id: img.id }, data: { url: next } });
    }
  }

  console.log("Cloudified.");
  await prisma.$disconnect();
}

main();
