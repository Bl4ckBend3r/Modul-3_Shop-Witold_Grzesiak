import { prisma } from "../src/lib/prisma";

async function main() {
  const order = await prisma.order.findUnique({
    where: { id: "cmfbiv42v000eil2kt2eoajfx" }
  });
  console.log(order);
}

main();
