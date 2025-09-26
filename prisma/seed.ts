import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

// import cloudMap from "cloudinary-map.json";

const prisma = new PrismaClient();

/** ===== Cloudinary helpers ===== */
type CloudType = "brand" | "products" | "payment" | "category";
type CloudItem = { type: CloudType; basenameSlug: string; secure_url: string };
const cloudMap = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "cloudinary-map.json"), "utf8")
);

const CLOUD = cloudMap as CloudItem[];

// aliasy slugów między Twoją bazą a mapą Cloudinary
const ALIAS: Record<CloudType, Record<string, string>> = {
  brand: { asus: "rog" },
  payment: { gpay: "googlepay", mc: "mastercard" },
  products: {},
  category: {},
};

function cdnUrl(type: CloudType, slug: string, { required = true } = {}) {
  const real = ALIAS[type]?.[slug] ?? slug;
  const hit = CLOUD.find((i) => i.type === type && i.basenameSlug === real);
  if (!hit?.secure_url) {
    if (required) {
      console.warn(
        `[Cloudinary] Brak URL dla type=${type} slug=${slug} (szukano: ${real}).`
      );
    }
    return null;
  }
  return hit.secure_url;
}

/** ===== Typy ===== */
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
  category: string;
  brand: string;
  description?: string;
  colors?: string[];
};

/** ===== Dane z Figmy (URL-e z Cloudinary) ===== */
const CATEGORIES: NewCategory[] = [
  {
    name: "Mouse",
    slug: "mouse",
    description: "Computer mice – gaming and office",
    image: cdnUrl("category", "mouse", { required: false }), // dodaj do JSON, na razie opcjonalnie
    exploreInfo: "Find the best mice for your setup",
  },
  {
    name: "Monitor",
    slug: "monitor",
    description: "Monitors – FullHD, 2K, 4K and ultrawide",
    image: cdnUrl("category", "monitor", { required: false }),
    exploreInfo: "Upgrade your display",
  },
  {
    name: "Headphone",
    slug: "headphone",
    description: "Wired and wireless headphones",
    image: cdnUrl("category", "headphone", { required: false }),
    exploreInfo: "Feel the sound",
  },
  {
    name: "Keyboard",
    slug: "keyboard",
    description: "Mechanical and membrane keyboards",
    image: cdnUrl("category", "keyboard", { required: false }),
    exploreInfo: "Type faster, play better",
  },
  {
    name: "Webcam",
    slug: "webcam",
    description: "Webcams for streaming and video calls",
    image: cdnUrl("category", "webcam", { required: false }),
    exploreInfo: "Look sharp online",
  },
];

const BRANDS: NewBrand[] = [
  { name: "Rexus", slug: "rexus", imageUrl: cdnUrl("brand", "rexus")! },
  {
    name: "Logitech",
    slug: "logitech",
    imageUrl: cdnUrl("brand", "logitech")!,
  },
  { name: "Razer", slug: "razer", imageUrl: cdnUrl("brand", "razer")! },
  { name: "Sony", slug: "sony", imageUrl: cdnUrl("brand", "sony")! },
  { name: "JBL", slug: "jbl", imageUrl: cdnUrl("brand", "jbl")! },
  { name: "AOC", slug: "aoc", imageUrl: cdnUrl("brand", "aoc")! },
  {
    name: "ASUS",
    slug: "asus",
    imageUrl:
      cdnUrl("brand", "asus", { required: false }) ?? cdnUrl("brand", "rog")!,
  },
];

const PRODUCTS: FixedProduct[] = [
  // Mouse
  {
    sku: "MOUSE-REXUS-X16",
    name: "Rexus Kierra X16",
    slug: "rexus-kierra-x16",
    price: 25.99,
    stock: 50,
    imageUrl: cdnUrl("products", "rexus-kierra-x16")!,
    category: "mouse",
    brand: "rexus",
    description:
      "The Xierra X16 mouse is a cutting-edge peripheral that combines precision and comfort.",
    colors: ["#000000"],
  },
  {
    sku: "MOUSE-LOGI-G502",
    name: "Logitech G502 Hero",
    slug: "logitech-g502-hero",
    price: 34.99,
    stock: 50,
    imageUrl: cdnUrl("products", "logitech-g502-hero")!,
    category: "mouse",
    brand: "logitech",
    description: "High-performance gaming mouse with HERO sensor.",
    colors: ["#000000"],
  },

  // Keyboard
  {
    sku: "KEYB-LOGI-G213",
    name: "Logitech G213 Prodigy",
    slug: "logitech-g213-prodigy",
    price: 49.99,
    stock: 30,
    imageUrl: cdnUrl("products", "logitech-g213-prodigy")!,
    category: "keyboard",
    brand: "logitech",
    description: "Spill-resistant RGB gaming keyboard.",
    colors: ["#000000"],
  },
  {
    sku: "KEYB-RAZER-HUNTS",
    name: "Razer Huntsman Elite",
    slug: "razer-huntsman-elite",
    price: 106.83,
    stock: 20,
    imageUrl: cdnUrl("products", "razer-huntsman-elite")!,
    category: "keyboard",
    brand: "razer",
    description: "Mechanical gaming keyboard with opto-mechanical switches.",
    colors: ["#000000"],
  },

  // Headphones
  {
    sku: "HEAD-SONY-WHCH510",
    name: "Sony WH-CH510",
    slug: "sony-wh-ch510",
    price: 59.99,
    stock: 40,
    imageUrl: cdnUrl("products", "sony-wh-ch510")!,
    category: "headphone",
    brand: "sony",
    description: "Wireless on-ear headphones with long battery life.",
    colors: ["#000000"],
  },
  {
    sku: "HEAD-JBL-TUNE500",
    name: "JBL Tune 500",
    slug: "jbl-tune-500",
    price: 29.95,
    stock: 40,
    imageUrl: cdnUrl("products", "jbl-tune-500")!,
    category: "headphone",
    brand: "jbl",
    description: "Lightweight on-ear headphones with JBL Pure Bass sound.",
    colors: ["#000000"],
  },

  // Monitors
  {
    sku: "MON-AOC-24G2E",
    name: "AOC 24G2E",
    slug: "aoc-24g2e",
    price: 209.99,
    stock: 15,
    imageUrl: cdnUrl("products", "aoc-24g2e")!,
    category: "monitor",
    brand: "aoc",
    description: "24-inch gaming monitor with 144Hz refresh rate.",
    colors: ["#000000"],
  },
  {
    sku: "MON-ASUS-PG259QN",
    name: "ROG Swift PG259QN",
    slug: "rog-swift-pg259qn",
    price: 299.99,
    stock: 10,
    imageUrl: cdnUrl("products", "rog-swift-pg259qn")!,
    category: "monitor",
    brand: "asus",
    description: "Fast 360Hz gaming monitor for esports.",
    colors: ["#000000"],
  },

  // Webcam
  {
    sku: "WEBCAM-LOGI-C920",
    name: "Logitech C920",
    slug: "logitech-c920",
    price: 79.99,
    stock: 25,
    imageUrl: cdnUrl("products", "logitech-c920")!,
    category: "webcam",
    brand: "logitech",
    description: "HD Pro Webcam with 1080p video quality.",
    colors: ["#000000"],
  },
];

/** ===== Płatności (ikony z Cloudinary) ===== */
const PAYMENTS = [
  { slug: "visa", name: "VISA", order: 1, iconUrl: cdnUrl("payment", "visa") },
  {
    slug: "mc",
    name: "Mastercard",
    order: 2,
    iconUrl: cdnUrl("payment", "mc") ?? cdnUrl("payment", "mastercard"),
  },
  {
    slug: "paypal",
    name: "PayPal",
    order: 3,
    iconUrl: cdnUrl("payment", "paypal"),
  },
  {
    slug: "gpay",
    name: "GPay",
    order: 4,
    iconUrl: cdnUrl("payment", "gpay") ?? cdnUrl("payment", "googlepay"),
  },
  {
    slug: "applepay",
    name: "Apple Pay",
    order: 5,
    iconUrl: cdnUrl("payment", "applepay"),
  },
];

/** ===== Helpers ===== */
const money = (n: number) => Number((Math.round(n * 100) / 100).toFixed(2));

function buildProductBase(
  i: number,
  category: { id: string; name: string; slug: string },
  brand: { id: string; name: string; slug: string }
) {
  const sku = `${category.slug.toUpperCase()}-${brand.slug.toUpperCase()}-${String(
    i
  ).padStart(3, "0")}`;
  const name = `${brand.name} ${category.name} ${i}`;
  const slug = `${brand.slug}-${category.slug}-${i}`;
  const price = money(79 + (i % 7) * 20 + Math.random() * 30);
  const stock = 10 + ((i * 3) % 25);

  // dla „syntetycznych” produktów użyj reprezentatywnego zdjęcia z mapy (per kategoria)
  const fallbackByCategory: Record<string, string> = {
    mouse: "logitech-g502-hero",
    keyboard: "logitech-g213-prodigy",
    headphone: "sony-wh-ch510",
    monitor: "aoc-24g2e",
    webcam: "logitech-c920",
  };
  const representative = fallbackByCategory[category.slug];
  const imageUrl = representative ? cdnUrl("products", representative)! : null;

  return { sku, name, slug, price, stock, imageUrl: imageUrl! };
}

/** ===== (reszta pliku bez zmian) ===== */

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
  const brands = await prisma.brand.findMany({
    select: { id: true, slug: true },
  });
  const categories = await prisma.category.findMany({
    select: { id: true, slug: true },
  });

  const brandBySlug = new Map<string, string>();
  for (const b of brands) brandBySlug.set(b.slug, b.id);

  const catBySlug = new Map<string, string>();
  for (const c of categories) catBySlug.set(c.slug, c.id);

  return { brandBySlug, catBySlug };
}

async function seedFixedProducts() {
  const { brandBySlug, catBySlug } = await getLookups();

  for (const p of PRODUCTS) {
    const brandId = brandBySlug.get(p.brand);
    const categoryId = catBySlug.get(p.category);
    if (!brandId || !categoryId) {
      console.warn(
        `Pominięto ${p.name} – brak brandId (${brandId}) lub categoryId (${categoryId}).`
      );
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
        colors: p.colors ?? [],
        category: { connect: { id: categoryId } },
        brand: { connect: { id: brandId } },
        images: { create: [{ url: p.imageUrl, alt: p.name, position: 0 }] },
      },
      update: {
        price: p.price,
        stock: p.stock,
        description: p.description,
        imageUrl: p.imageUrl,
        colors: p.colors ?? [],
      },
    });
  }
}

/* ========= Dopełnij do min. 5 / kategorię ========= */
async function ensureMinFivePerCategory() {
  const categories = await prisma.category.findMany({
    select: { id: true, name: true, slug: true },
  });
  const brands = await prisma.brand.findMany({
    select: { id: true, name: true, slug: true },
  });

  for (const category of categories) {
    const already = await prisma.product.count({
      where: { categoryId: category.id },
    });
    if (already >= 5) continue;

    const toCreate = 5 - already;
    for (let i = 1; i <= toCreate; i++) {
      const brand = brands[(already + i) % brands.length];
      const base = buildProductBase(already + i, category, brand);

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
          brand: { connect: { id: brand.id } },
          images: {
            create: [{ url: base.imageUrl, alt: base.name, position: 0 }],
          },
        },
        update: {},
      });
    }
    console.log(
      `Dopełniono kategorię ${category.slug} o ${toCreate} szt. (łącznie min. 5).`
    );
  }
}

/* ========= Użytkownik testowy ========= */
async function seedUserWithAddress() {
  const passwordHash = await hash("password", 10);
  await prisma.user.upsert({
    where: { email: "test@example.com" },
    create: {
      email: "test@example.com",
      firstName: "Test",
      lastName: "User",
      passwordHash,
      addresses: {
        create: [
          {
            line1: "Bangalau Road No 23, RT 4/RW 6, Kinajaya ",
            city: "Jakarta",
            province: "Jakarta",
            postal: "12819",
            country: "ID",
            isDefault: true,
          },
        ],
      },
    },
    update: {
      addresses: {
        create: [
          {
            line1: "Bangalau Road No 23, RT 4/RW 6, Kinajaya ",
            city: "Jakarta",
            province: "Jakarta",
            postal: "12819",
            country: "ID",
            isDefault: true,
          },
        ],
      },
    },
  });
}

/* ========= Walidacja wyników (liczniki) ========= */
async function printSummary() {
  const cats = await prisma.category.findMany({
    select: { id: true, slug: true, name: true },
  });
  for (const c of cats) {
    const cnt = await prisma.product.count({ where: { categoryId: c.id } });
    console.log(`Kategoria ${c.slug} (${c.name}) → ${cnt} produktów`);
  }
}

/* ========= Seed: metody płatności ========= */
async function seedPayments() {
  for (const p of PAYMENTS) {
    await prisma.payment.upsert({
      where: { slug: p.slug },
      create: { ...p, isActive: true },
      update: {
        name: p.name,
        order: p.order,
        iconUrl: (p as any).iconUrl ?? null,
        isActive: true,
      },
    });
  }
}
/* ========= Zamówienie testowe ========= */
async function seedOrder() {
  const user = await prisma.user.findFirst({
    where: { email: "test@example.com" },
  });
  const product = await prisma.product.findFirst();

  if (!user || !product) {
    console.warn("Brak usera lub produktu – pomijam zamówienie");
    return;
  }

  const order = await prisma.order.create({
    data: {
      userId: user.id,
      status: "PAID",
      totalAmount: product.price.mul(2), // Decimal → Prisma doda metodę .mul
      shipName: `${user.firstName} ${user.lastName ?? ""}`,
      shipLine1: "Test Street 123",
      shipCity: "Warsaw",
      shipPostal: "00-000",
      shipCountry: "PL",
      items: {
        create: [
          {
            productId: product.id,
            quantity: 2,
            priceAtPurchase: product.price,
          },
        ],
      },
    },
    include: { items: { include: { product: true } } },
  });

  console.log("Seeded order:", order.id);
}

/* ========= Main ========= */
async function main() {
  console.log("Seeding...");

  await seedBrands();
  await seedCategories();
  await seedFixedProducts();
  await ensureMinFivePerCategory();
  await seedUserWithAddress();
  await printSummary();
  await seedPayments();
  await seedOrder();

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
