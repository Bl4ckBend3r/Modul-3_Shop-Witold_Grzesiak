// prisma/seed.ts
import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma';
import { cloudMap } from '@/lib/cloudinary-map';



const prisma = new PrismaClient();

/* ========= Typy ========= */
type NewCategory = {
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  exploreInfo?: string | null;
};

type NewBrand = {
  name: string;
  slug: string;
  imageUrl?: string | null;
};

type FixedProduct = {
  sku: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  imageUrl: string;
  category: string; // slug kategorii
  brand: string;    // slug brandu
  description?: string;
};

/* ========= Dane z Figmy ========= */
const CATEGORIES: NewCategory[] = [
  { name: 'Mouse',     slug: 'mouse',     description: 'Computer mice – gaming and office',        image: '/images/categories/mouse.png',     exploreInfo: 'Find the best mice for your setup' },
  { name: 'Monitor',   slug: 'monitor',   description: 'Monitors – FullHD, 2K, 4K and ultrawide',  image: '/images/categories/monitor.png',   exploreInfo: 'Upgrade your display' },
  { name: 'Headphone', slug: 'headphone', description: 'Wired and wireless headphones',            image: '/images/categories/headphone.png', exploreInfo: 'Feel the sound' },
  { name: 'Keyboard',  slug: 'keyboard',  description: 'Mechanical and membrane keyboards',        image: '/images/categories/keyboard.png',  exploreInfo: 'Type faster, play better' },
  { name: 'Webcam',    slug: 'webcam',    description: 'Webcams for streaming and video calls',    image: '/images/categories/webcam.png',    exploreInfo: 'Look sharp online' },
];

const BRANDS: NewBrand[] = [
  { name: 'Rexus',    slug: 'rexus',    imageUrl: '/images/brands/rexus.png' },
  { name: 'Logitech', slug: 'logitech', imageUrl: '/images/brands/logitech.png' },
  { name: 'Razer',    slug: 'razer',    imageUrl: '/images/brands/razer.png' },
  { name: 'Sony',     slug: 'sony',     imageUrl: '/images/brands/sony.png' },
  { name: 'JBL',      slug: 'jbl',      imageUrl: '/images/brands/jbl.png' },
  { name: 'AOC',      slug: 'aoc',      imageUrl: '/images/brands/aoc.png' },
  { name: 'ASUS',     slug: 'asus',     imageUrl: '/images/brands/asus.png' },
];

const PRODUCTS: FixedProduct[] = [
  // Mouse
  { sku: 'MOUSE-REXUS-X16',   name: 'Rexus Kierra X16',   slug: 'rexus-kierra-x16',   price: 25.99, stock: 50, imageUrl: '/images/products/mouse-1.jpg',   category: 'mouse',    brand: 'rexus',    description: 'The Xierra X16 mouse is a cutting-edge peripheral that combines precision and comfort.' },
  { sku: 'MOUSE-LOGI-G502',   name: 'Logitech G502 Hero', slug: 'logitech-g502-hero', price: 34.99, stock: 50, imageUrl: '/images/products/mouse-2.jpg',   category: 'mouse',    brand: 'logitech', description: 'High-performance gaming mouse with HERO sensor.' },

  // Keyboard
  { sku: 'KEYB-LOGI-G213',    name: 'Logitech G213 Prodigy',  slug: 'logitech-g213-prodigy', price: 49.99,  stock: 30, imageUrl: '/images/products/keyboard-1.jpg', category: 'keyboard', brand: 'logitech', description: 'Spill-resistant RGB gaming keyboard.' },
  { sku: 'KEYB-RAZER-HUNTS',  name: 'Razer Huntsman Elite',   slug: 'razer-huntsman-elite',  price: 106.83, stock: 20, imageUrl: '/images/products/keyboard-2.jpg', category: 'keyboard', brand: 'razer',    description: 'Mechanical gaming keyboard with opto-mechanical switches.' },

  // Headphones
  { sku: 'HEAD-SONY-WHCH510', name: 'Sony WH-CH510',         slug: 'sony-wh-ch510',    price: 59.99, stock: 40, imageUrl: '/images/products/headphone-1.jpg', category: 'headphone', brand: 'sony', description: 'Wireless on-ear headphones with long battery life.' },
  { sku: 'HEAD-JBL-TUNE500',  name: 'JBL Tune 500',          slug: 'jbl-tune-500',     price: 29.95, stock: 40, imageUrl: '/images/products/headphone-2.jpg', category: 'headphone', brand: 'jbl',  description: 'Lightweight on-ear headphones with JBL Pure Bass sound.' },

  // Monitors
  { sku: 'MON-AOC-24G2E',     name: 'AOC 24G2E',            slug: 'aoc-24g2e',         price: 209.99, stock: 15, imageUrl: '/images/products/monitor-1.jpg', category: 'monitor', brand: 'aoc',  description: '24-inch gaming monitor with 144Hz refresh rate.' },
  { sku: 'MON-ASUS-PG259QN',  name: 'ROG Swift PG259QN',    slug: 'rog-swift-pg259qn', price: 299.99, stock: 10, imageUrl: '/images/products/monitor-2.jpg', category: 'monitor', brand: 'asus', description: 'Fast 360Hz gaming monitor for esports.' },

  // Webcam
  { sku: 'WEBCAM-LOGI-C920',  name: 'Logitech C920',        slug: 'logitech-c920',     price: 79.99,  stock: 25, imageUrl: '/images/products/webcam-1.jpg',  category: 'webcam',  brand: 'logitech', description: 'HD Pro Webcam with 1080p video quality.' },
];



/* ========= Helpers ========= */
const money = (n: number) => Number((Math.round(n * 100) / 100).toFixed(2));

function buildProductBase(
  i: number,
  category: { id: string; name: string; slug: string },
  brand: { id: string; name: string; slug: string }
) {
  const sku = `${category.slug.toUpperCase()}-${brand.slug.toUpperCase()}-${String(i).padStart(3, '0')}`;
  const name = `${brand.name} ${category.name} ${i}`;
  const slug = `${brand.slug}-${category.slug}-${i}`;
  const price = money(79 + (i % 7) * 20 + Math.random() * 30);
  const stock = 10 + ((i * 3) % 25);
  const imageUrl = `https://res.cloudinary.com/damzxycku/image/upload/v1755723011/products/${category.slug}-${(i % 5) + 1}.png`;
  return { sku, name, slug, price, stock, imageUrl };
}
/* ========= Seed: marki i kategorie ========= */
async function seedBrands() {
  for (const b of BRANDS) {
    await prisma.brand.upsert({
      where: { slug: b.slug },
      create: b,
      update: b,
    });
  }
}

async function seedCategories() {
  for (const c of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      create: c,
      update: c,
    });
  }
}

/* ========= Produkty stałe z Figmy ========= */
async function getLookups() {
  const brands = await prisma.brand.findMany({ select: { id: true, slug: true } });
  const categories = await prisma.category.findMany({ select: { id: true, slug: true } });

  const brandBySlug = new Map(brands.map((b) => [b.slug, b.id]));
  const catBySlug   = new Map(categories.map((c) => [c.slug, c.id]));
  return { brandBySlug, catBySlug };
}

async function seedFixedProducts() {
  const { brandBySlug, catBySlug } = await getLookups();

  for (const p of PRODUCTS) {
    const brandId = brandBySlug.get(p.brand);
    const categoryId = catBySlug.get(p.category);
    if (!brandId || !categoryId) {
      console.warn(`Pominięto ${p.name} – brak brandId (${brandId}) lub categoryId (${categoryId}).`);
      continue;
    }

    await prisma.product.upsert({
      where: { slug: p.slug },
      create: {
        sku: p.sku,
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        stock: p.stock,
        imageUrl: p.imageUrl,
        category: { connect: { id: categoryId } },
        brand:    { connect: { id: brandId } },
        images:   { create: [{ url: p.imageUrl, alt: p.name, position: 0 }] },
      },
      update: {
        price: p.price,
        stock: p.stock,
        description: p.description,
        imageUrl: p.imageUrl,
      },
    });
  }
}

/* ========= Dopełnij do min. 5 / kategorię ========= */
async function ensureMinFivePerCategory() {
  const categories = await prisma.category.findMany({ select: { id: true, name: true, slug: true } });
  const brands     = await prisma.brand.findMany({ select: { id: true, name: true, slug: true } });

  for (const category of categories) {
    const already = await prisma.product.count({ where: { categoryId: category.id } });
    if (already >= 5) continue;

    const toCreate = 5 - already;
    for (let i = 1; i <= toCreate; i++) {
      const brand = brands[(already + i) % brands.length];
      const base  = buildProductBase(already + i, category, brand);

      await prisma.product.upsert({
        where: { slug: base.slug },
        create: {
          sku: base.sku,
          name: base.name,
          slug: base.slug,
          description: `Opis produktu ${base.name}. Wygoda, styl i trwałość.`,
          price: base.price,
          stock: base.stock,
          imageUrl: base.imageUrl,
          category: { connect: { id: category.id } },
          brand:    { connect: { id: brand.id } },
          images:   { create: [{ url: base.imageUrl, alt: base.name, position: 0 }] },
        },
        update: {},
      });
    }
    console.log(`Dopełniono kategorię ${category.slug} o ${toCreate} szt. (łącznie min. 5).`);
  }
}

/* ========= Użytkownik testowy ========= */
async function seedUserWithAddress() {
  await prisma.user.upsert({
    where: { email: 'test@example.com' },
    create: {
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      passwordHash: 'plain:password', 
      addresses: {
        create: [
          { line1: 'Tadeusza Konicza 7', city: 'Zielona Góra', postal: '65-001', country: 'PL', isDefault: true },
        ],
      },
    },
    update: {},
  });
}

/* ========= Walidacja wyników (liczniki) ========= */
async function printSummary() {
  const cats = await prisma.category.findMany({ select: { id: true, slug: true, name: true } });
  for (const c of cats) {
    const cnt = await prisma.product.count({ where: { categoryId: c.id } });
    console.log(`Kategoria ${c.slug} (${c.name}) → ${cnt} produktów`);
  }
}

/* ========= Main ========= */
async function main() {
  console.log('Seeding...');

  await seedBrands();
  await seedCategories();
  await seedFixedProducts();
  await ensureMinFivePerCategory();
  await seedUserWithAddress();
  await printSummary();

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
