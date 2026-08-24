import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const categories = [
  { slug: "disposable", name: "Disposable", sortOrder: 0 },
  { slug: "pods", name: "Pods", sortOrder: 1 },
  { slug: "e-liquid", name: "E-liquid", sortOrder: 2 },
  { slug: "devices", name: "Devices", sortOrder: 3 },
  { slug: "accessories", name: "Accessories", sortOrder: 4 },
];

async function main() {
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      create: category,
      update: { name: category.name, sortOrder: category.sortOrder },
    });
  }

  await prisma.storeInfo.upsert({
    where: { id: "singleton" },
    create: {
      id: "singleton",
      name: "Your Vape Store",
      addressLine: "123 Main St",
      city: "Anytown",
      state: "CA",
      zip: "00000",
      phone: "(555) 555-5555",
      hours: {
        mon: "10:00-20:00",
        tue: "10:00-20:00",
        wed: "10:00-20:00",
        thu: "10:00-20:00",
        fri: "10:00-21:00",
        sat: "10:00-21:00",
        sun: "11:00-18:00",
      },
    },
    update: {},
  });

  console.log(`Seeded ${categories.length} categories and the StoreInfo singleton.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
