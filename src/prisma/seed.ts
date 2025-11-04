import { PrismaClient } from "@prisma/client";
import { seedDatabase } from "../lib/seeding";

const prisma = new PrismaClient();

async function main() {
  console.log("Running standalone seed script...");
  await seedDatabase(prisma);
}

main()
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
