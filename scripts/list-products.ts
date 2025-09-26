import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const products: { name: string }[] = await prisma.product.findMany({
    select: { name: true },
  });

  console.log("Produkty w bazie:");
  products.forEach((p) => console.log(p.name));
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
