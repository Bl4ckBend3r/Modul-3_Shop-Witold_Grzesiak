import { prisma } from "@/lib/prisma";

async function main() {
  const order = await prisma.order.findFirst();
  console.log("First order:", order);
}

main();
