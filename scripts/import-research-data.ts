import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient, type Prisma } from "../src/generated/prisma/client";
import { slugify } from "../src/lib/validations/shared";

// One-off import of vape_product_research.xlsx (client-provided test data,
// not checked into the repo). Safe to re-run: brands are upserted by slug,
// and product slugs are de-duplicated, so re-running just adds a "-2" etc.
// copy rather than erroring. Run with: pnpm tsx scripts/import-research-data.ts

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const DEFAULT_IMAGE_KEY = "vape_example.png";
const DEFAULT_IMAGE_URL = `${process.env.R2_PUBLIC_URL}/${DEFAULT_IMAGE_KEY}`;

const CATEGORY_SLUG_BY_NAME: Record<string, string> = {
  "Disposable Vapes": "disposable",
  "Closed Pod Systems": "pods",
  "E-Liquids": "e-liquid",
  Devices: "devices",
  Accessories: "accessories",
};

type Row = {
  category: string;
  name: string;
  brand?: string;
  productType?: string;
  puffCount?: string;
  capacity?: string;
  nicotineStrength?: string;
  battery?: string;
  rechargeable?: string;
  coil?: string;
  modesOutput?: string;
  airflow?: string;
  display?: string;
  compatibilityNotes?: string;
  dimensions?: string;
  researchStatus?: string;
  sourceUrl?: string;
};

// Transcribed from vape_product_research.xlsx ("Product Research" sheet).
// Skipped "Nicotine Free" (row 22) — the sheet's own notes flag it as a
// variant/tag rather than a real product.
const rows: Row[] = [
  {
    category: "Disposable Vapes",
    name: "Flavour Beast Beast Mode Max 3",
    brand: "Flavour Beast",
    productType: "Rechargeable disposable",
    puffCount: "60,000",
    capacity: "20 mL",
    battery: "850 mAh",
    rechargeable: "Yes / USB-C",
    coil: "Single mesh 1.0Ω (Eco/Normal); Dual mesh 0.5Ω (Beast/Max)",
    modesOutput: "Eco 10W; Normal 14W; Beast 18W (19W burst); Max 23W (25W burst)",
    airflow: "Adjustable",
    display: "Smart display: e-liquid, battery, mode",
    compatibilityNotes: "4 dynamic modes",
    dimensions: "105.82 × 51.38 × 24 mm",
    researchStatus: "Verified from Canadian retailer",
    sourceUrl:
      "https://www.vapesbyenushi.com/flavour-beast-beast-mode-max-3-60000-puff-disposable-vape/",
  },
  {
    category: "Disposable Vapes",
    name: "Flavour Beast Alpha 80K",
    brand: "Flavour Beast",
    productType: "Rechargeable disposable",
    puffCount: "80,000",
    capacity: "30 mL",
    nicotineStrength: "20 mg/mL",
    battery: "850 mAh",
    rechargeable: "Yes / USB-C",
    coil: "Single mesh 1.0Ω (levels 1–2); Dual mesh 0.5Ω (levels 3–4)",
    modesOutput: "10W / 14W / 18W / 23W",
    airflow: "Adjustable",
    display: "Retro dot-matrix display",
    compatibilityNotes: "4 power levels",
    dimensions: "52 × 27.5 × 110 mm",
    researchStatus: "Verified from multiple Canadian sources",
    sourceUrl: "https://www.majesticvapes.ca/ontario/product/flavour-beast-alpha-80k-cherry-blast-iced/",
  },
  {
    category: "Disposable Vapes",
    name: "Kraze Giga 150K",
    brand: "Kraze",
    productType: "Rechargeable disposable",
    puffCount: "150,000",
    capacity: "40 mL (2 × 20 mL)",
    nicotineStrength: "20 mg/mL",
    battery: "1000 mAh",
    rechargeable: "Yes / USB-C",
    coil: "2 × 0.8Ω VPU dual-mesh",
    modesOutput: "Norm 12W; Boost 22W",
    airflow: "Adjustable",
    display: "Smart display: e-liquid, battery, mode",
    compatibilityNotes: "Sealed/non-refillable",
    dimensions: "58.7 × 113.4 × 32.4 mm",
    researchStatus: "Verified from current Canadian source",
    sourceUrl: "https://vapecloud.ca/products/kraze-giga-40ml-disposable-vape-150-000-puffs",
  },
  {
    category: "Disposable Vapes",
    name: "ELFBAR BC1000 / BC10000",
    brand: "ELFBAR",
    researchStatus: "Needs exact model confirmation",
  },
  {
    category: "Disposable Vapes",
    name: "ELFBAR GH2000",
    brand: "ELFBAR",
    researchStatus: "Could not confidently match exact current product",
  },
  {
    category: "Disposable Vapes",
    name: "ELFBAR Moonnight 70K",
    brand: "ELFBAR",
    puffCount: "70,000",
    researchStatus: "Needs exact product/source confirmation",
  },
  {
    category: "Disposable Vapes",
    name: "Allo Ultra 2500",
    brand: "Allo",
    productType: "Non-rechargeable disposable",
    puffCount: "2,500",
    capacity: "8 mL",
    nicotineStrength: "20 mg/mL",
    battery: "1300–1500 mAh",
    rechargeable: "No",
    coil: "Mesh coil",
    modesOutput: "Smart chipset",
    compatibilityNotes: "Some sources differ on battery (1300 vs 1500 mAh)",
    dimensions: "23 × 113.5 mm",
    researchStatus: "Verified; battery discrepancy noted",
    sourceUrl: "https://allo.ca/",
  },
  {
    category: "Disposable Vapes",
    name: "Allo Ultra 1600",
    brand: "Allo",
    productType: "Non-rechargeable disposable",
    puffCount: "1,600",
    capacity: "6–6.8 mL",
    nicotineStrength: "20 mg/mL",
    battery: "1000 mAh",
    rechargeable: "No",
    coil: "Mesh coil",
    modesOutput: "Smart chipset",
    compatibilityNotes: "Draw-activated",
    dimensions: "19 × 111 × 19 mm",
    researchStatus: "Verified; capacity differs by listing",
    sourceUrl: "https://royalevapor.ca/products/allo-1600",
  },
  {
    category: "Disposable Vapes",
    name: "Orbito Lumo AI 120K",
    brand: "Orbito",
    productType: "Rechargeable disposable",
    puffCount: "120,000",
    capacity: "30 mL",
    nicotineStrength: "10 or 20 mg/mL",
    battery: "1200 mAh",
    rechargeable: "Yes / USB-C",
    coil: "Dual 1.0Ω mesh",
    modesOutput: "AI ECO / AI BOOST (adaptive)",
    airflow: "Adjustable",
    display: "Colour screen: battery, e-liquid, mode",
    compatibilityNotes: "AI smart chipset; prefilled/non-refillable",
    researchStatus: "Verified from current Canadian source",
    sourceUrl: "https://vapecloud.ca/products/orbito-lumo-ai-120k",
  },
  {
    category: "Disposable Vapes",
    name: "Insta Bar 120K",
    brand: "Insta Bar",
    productType: "Rechargeable disposable",
    puffCount: "120,000",
    capacity: "30 mL",
    nicotineStrength: "20 mg/mL",
    battery: "1000 mAh",
    rechargeable: "Yes / USB-C",
    coil: "Dual mesh",
    modesOutput: "Regular / Turbo",
    airflow: "Adjustable",
    display: "Oversized display: battery & e-liquid",
    compatibilityNotes: "Prefilled disposable",
    researchStatus: "Verified from multiple Canadian sources",
    sourceUrl: "https://vapecloud.ca/apps/fireamp/products/insta-bar-120k",
  },
  {
    category: "Disposable Vapes",
    name: "Insta Bar Mega Pro 160K",
    brand: "Insta Bar",
    productType: "Rechargeable disposable",
    puffCount: "160,000",
    capacity: "40 mL",
    nicotineStrength: "20 mg/mL",
    rechargeable: "Yes / USB-C",
    coil: "Dual mesh",
    airflow: "Adjustable flow control",
    display: "Smart screen",
    researchStatus: "Partially verified; battery capacity not found",
    sourceUrl: "https://www.vaporshoppe.ca/products/insta-bar-mega-pro-160k-pineapple-coconut-ice",
  },
  {
    category: "Disposable Vapes",
    name: "Insta Bar GO",
    brand: "Insta Bar",
    productType: "Non-rechargeable disposable",
    puffCount: "~600",
    capacity: "2 mL",
    nicotineStrength: "20 mg/mL",
    battery: "400–500 mAh",
    rechargeable: "No",
    coil: "1.2Ω mesh",
    airflow: "None",
    compatibilityNotes: "Auto-draw",
    dimensions: "Ø17 × 100 mm",
    researchStatus: "Verified; battery varies by source",
    sourceUrl: "https://vapecloud.ca/products/insta-bar-go",
  },
  {
    category: "Disposable Vapes",
    name: "OXVA / Oxvar Mini",
    researchStatus: "Name/model needs confirmation",
  },
  {
    category: "Disposable Vapes",
    name: "Ranger",
    researchStatus: "Name too ambiguous; exact brand/model needed",
  },
  {
    category: "Disposable Vapes",
    name: "STLTH ECO",
    brand: "STLTH",
    productType: "Non-rechargeable disposable",
    capacity: "6 mL",
    nicotineStrength: "20 mg/mL",
    battery: "1000 mAh",
    rechargeable: "No",
    coil: "Single coil",
    airflow: "No",
    display: "Battery/puff indicator",
    compatibilityNotes: "Draw-activated; non-refillable",
    dimensions: "21.1 × 98 × 21.1 mm",
    researchStatus: "Verified from official STLTH sources",
    sourceUrl:
      "https://stlth.zendesk.com/hc/en-us/articles/35515531558548-STLTH-ECO-Disposable-User-Manual",
  },
  {
    category: "Disposable Vapes",
    name: "STLTH ECO BOX",
    brand: "STLTH",
    productType: "Rechargeable disposable",
    capacity: "10 mL",
    nicotineStrength: "20 mg/mL",
    battery: "650 mAh",
    rechargeable: "Yes / USB-C",
    modesOutput: "Adjustable",
    display: "LED: battery & e-liquid",
    compatibilityNotes: "Non-refillable",
    researchStatus: "Verified from official STLTH source",
    sourceUrl: "https://stlthvape.com/products/stlth-eco-box-flavourless",
  },
  {
    category: "Disposable Vapes",
    name: "STLTH ECO XL",
    brand: "STLTH",
    productType: "Rechargeable disposable",
    capacity: "20 mL",
    nicotineStrength: "20 mg/mL",
    battery: "850 mAh",
    rechargeable: "Yes / USB-C",
    coil: "Dual coil",
    modesOutput: "Normal / Boost",
    airflow: "Adjustable",
    display: "LED screen",
    compatibilityNotes: "Largest ECO model",
    researchStatus: "Verified from Canadian retailer / STLTH comparison",
    sourceUrl: "https://vapingtheway.ca/products/stlth-eco-xl-disposable",
  },
  {
    category: "Disposable Vapes",
    name: "Geek Bar Pulse 2 25K",
    brand: "Geek Bar",
    productType: "Rechargeable disposable",
    puffCount: "25,000",
    battery: "USB-C rechargeable",
    rechargeable: "Yes / USB-C",
    coil: "Dual mesh",
    airflow: "Adjustable",
    display: "Smart e-liquid & battery screen",
    compatibilityNotes: "Canadian exact nicotine/capacity should be confirmed",
    researchStatus: "Partially verified; source may be non-Canadian formulation",
    sourceUrl: "https://geek-bar.org/products/geek-bar-pulse-2-25k-disposable-vape/",
  },
  {
    category: "Disposable Vapes",
    name: "STLTH × Geek Bar 80K",
    brand: "STLTH × Geek Bar",
    productType: "Rechargeable disposable",
    puffCount: "80,000",
    capacity: "30 mL",
    nicotineStrength: "20 mg/mL",
    battery: "820 mAh",
    rechargeable: "Yes / USB-C",
    modesOutput: "Normal / Pulse",
    airflow: "Adjustable",
    display: "Full screen: battery, e-liquid, mode",
    compatibilityNotes: "Draw-activated; non-refillable",
    researchStatus: "Verified from current Canadian source",
    sourceUrl: "https://vapecloud.ca/products/stlth-x-geek-bar-disposable-vape-cloud-canada",
  },
  {
    category: "Disposable Vapes",
    name: "Gippro Fuji 70K",
    brand: "Gippro / Fuji",
    productType: "Rechargeable disposable",
    puffCount: "70,000",
    capacity: "20 mL",
    nicotineStrength: "20 mg/mL",
    rechargeable: "Rechargeable",
    compatibilityNotes: "Ready-to-use high-capacity disposable",
    researchStatus: "Partially verified",
    sourceUrl: "https://www.dundasvapes.ca/products/gippro-fuji-70k-puffs-disposable-vape-polar-mint",
  },
  {
    category: "Closed Pod Systems",
    name: "Level X M Series 30mL",
    brand: "LEVEL X / Flavour Beast",
    productType: "Prefilled replacement pod",
    puffCount: "120,000",
    capacity: "30 mL",
    nicotineStrength: "20 mg/mL",
    battery: "Device: 1000 mAh (starter kit)",
    rechargeable: "Reusable M Series device",
    coil: "Dual mesh",
    modesOutput: "11W / 17W / 23W via device",
    airflow: "Adjustable via device",
    display: "Device display",
    compatibilityNotes: "M Series only; not G Series",
    researchStatus: "Verified from current Canadian source",
    sourceUrl: "https://vapecloud.ca/products/level-x-m-series-30ml-pods-vape-cloud-canada",
  },
  {
    category: "Closed Pod Systems",
    name: "Level X M Series 40mL",
    brand: "LEVEL X / Flavour Beast",
    productType: "Prefilled replacement pod",
    puffCount: "160,000",
    capacity: "40 mL",
    compatibilityNotes: "M Series family; exact detailed specs need confirmation",
    researchStatus: "Partially verified (capacity/puff count)",
    sourceUrl: "https://www.vapesbyenushi.com/",
  },
  {
    category: "Closed Pod Systems",
    name: "Ripper X 75K",
    brand: "Ripper X",
    productType: "Prefilled replacement pod",
    puffCount: "75,000",
    capacity: "20 mL",
    nicotineStrength: "20 mg/mL",
    rechargeable: "Uses Ripper X Ultra 1000mAh battery (sold separately)",
    coil: "Next-gen food-grade dual mesh",
    airflow: "Dual airflow",
    compatibilityNotes: "Also reported compatible with some Level X batteries",
    researchStatus: "Verified from Canadian retailer",
    sourceUrl: "https://www.freestylevapes.ca/ripper-x-75k-disposable.html",
  },
  {
    category: "Closed Pod Systems",
    name: "STLTH LOOP 25K",
    brand: "STLTH",
    productType: "Prefilled replacement pod",
    puffCount: "25,000",
    capacity: "20 mL",
    nicotineStrength: "20 mg/mL",
    battery: "Separate rechargeable LOOP device",
    rechargeable: "Pod uses reusable device",
    coil: "Vertical mesh",
    airflow: "Device-dependent / some listings say adjustable",
    display: "E-liquid level reading via compatible device",
    compatibilityNotes: "Compatible with LOOP 2/3 depending generation",
    researchStatus: "Verified from Canadian sources",
    sourceUrl:
      "https://www.libertyvape.ca/products/stlth-loop-25k-pod-pack-all-flavours-25000-puffs-20ml",
  },
  {
    category: "Closed Pod Systems",
    name: "STLTH LOOP Max 70K",
    brand: "STLTH",
    productType: "Prefilled replacement pod",
    puffCount: "70,000",
    capacity: "30 mL",
    nicotineStrength: "20 mg/mL",
    battery: "Separate LOOP Max device",
    rechargeable: "Reusable device",
    coil: "Mesh",
    modesOutput: "Normal / Boost via device",
    airflow: "Adjustable via device",
    display: "E-liquid/battery readout via device",
    compatibilityNotes: "Magnetic; LOOP Max device",
    researchStatus: "Verified from Canadian sources",
    sourceUrl: "https://univape.ca/collections/stlth-loop-70k-pre-filled-pods",
  },
  {
    category: "Closed Pod Systems",
    name: "OXBAR Maglink 90K",
    brand: "OXBAR / Rocky Vapor",
    productType: "Prefilled replacement pod / starter kit",
    puffCount: "90,000",
    capacity: "30 mL",
    nicotineStrength: "20 mg/mL",
    battery: "1500 mAh reusable battery",
    rechargeable: "Yes / USB-C",
    coil: "Dual mesh",
    modesOutput: "Eco / Boost",
    airflow: "Adjustable",
    display: "LED: battery, e-liquid, mode",
    compatibilityNotes: "Magnetic proprietary Maglink connection",
    researchStatus: "Verified from current Canadian sources",
    sourceUrl: "https://vapingtheway.ca/products/rocky-vapor-oxbar-maglink-90k-starter-kit",
  },
  {
    category: "Closed Pod Systems",
    name: "STLTH Pod",
    brand: "STLTH",
    productType: "Prefilled pod",
    capacity: "2 mL",
    rechargeable: "Uses STLTH device",
    compatibilityNotes: "Exact pod nicotine/flavour varies",
    researchStatus: "Partially verified; exact pod variant needed",
    sourceUrl: "https://6ixvape.ca/products/stlth-device",
  },
  {
    category: "Closed Pod Systems",
    name: "Flavour Beast Pod",
    brand: "Flavour Beast",
    productType: "Prefilled pod",
    compatibilityNotes: "Exact product family unclear; may refer to STLTH-compatible/Level X product",
    researchStatus: "Needs exact model confirmation",
  },
  {
    category: "Closed Pod Systems",
    name: "ZPod",
    productType: "Prefilled pod",
    compatibilityNotes: "Exact brand/model unclear",
    researchStatus: "Needs exact model confirmation",
  },
  {
    category: "E-Liquids",
    name: "Flavour Beast",
    brand: "Flavour Beast",
    productType: "E-liquid",
    compatibilityNotes: "Bottle size/strength depends on exact line; exact SKU needed",
    researchStatus: "Needs exact line/SKU confirmation",
  },
  {
    category: "E-Liquids",
    name: "Lemon Drop",
    brand: "Lemon Drop",
    productType: "E-liquid",
    compatibilityNotes: "Bottle size/strength depends on exact line; exact SKU needed",
    researchStatus: "Needs exact line/SKU confirmation",
  },
  {
    category: "E-Liquids",
    name: "Suavae",
    brand: "Suavae",
    productType: "E-liquid",
    compatibilityNotes: "Search results indicate 60mL salt variants exist; exact SKU/strength needed",
    researchStatus: "Partially identified; exact SKU needed",
  },
  {
    category: "Devices",
    name: "UWELL Caliburn G5",
    brand: "UWELL",
    productType: "Refillable pod kit",
    capacity: "2 mL / 3 mL pods",
    battery: "1600 mAh",
    rechargeable: "Yes / USB-C",
    coil: "GPP / GPP Alpha cartridges",
    modesOutput: "Up to 35W",
    airflow: "Stepless adjustable",
    display: "0.85-inch HD TFT / themes",
    compatibilityNotes: "Compatible with GPP series; auto-draw",
    researchStatus: "Verified from current Canadian sources",
    sourceUrl:
      "https://www.dashvapes.com/ca/products/vape-kits/1/uwell-caliburn-g5-pod-kit-creamy-celadon/5734/49592",
  },
  {
    category: "Devices",
    name: "STLTH Device",
    brand: "STLTH",
    productType: "Closed pod device",
    capacity: "2 mL pod",
    battery: "470 mAh (current official manual)",
    rechargeable: "Yes / USB-C",
    modesOutput: "MTL",
    display: "LED battery indicator",
    compatibilityNotes: "STLTH pod cartridge system",
    dimensions: "19.1 × 11.1 × 91.5 mm device",
    researchStatus: "Verified from official STLTH manual; older listings may show 420mAh",
    sourceUrl:
      "https://stlth.zendesk.com/hc/en-us/articles/18402426996500-STLTH-DEVICE-USER-MANUAL",
  },
  {
    category: "Accessories",
    name: "UWELL Caliburn GPP Pods",
    brand: "UWELL",
    productType: "Refillable replacement pod",
    capacity: "3 mL",
    coil: "0.4Ω / 0.6Ω / 0.9Ω / 1.2Ω",
    airflow: "Dual airflow by pod orientation",
    compatibilityNotes: "Compatible with Caliburn G3/G4/G5 families; Canadian packs often 4",
    researchStatus: "Verified from current Canadian sources",
    sourceUrl: "https://itsnotsmoke.ca/products/caliburn-g3-pods-4-pk",
  },
];

function cleanPuffCount(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const digits = value.replace(/[^0-9]/g, "");
  if (!digits) return undefined;
  return Number.parseInt(digits, 10);
}

async function ensureBrand(name: string): Promise<string> {
  const slug = slugify(name);
  const brand = await prisma.brand.upsert({
    where: { slug },
    create: { slug, name },
    update: {},
  });
  return brand.id;
}

async function uniqueSlug(base: string): Promise<string> {
  let candidate = slugify(base);
  let suffix = 2;
  while (await prisma.product.findUnique({ where: { slug: candidate } })) {
    candidate = `${slugify(base)}-${suffix}`;
    suffix += 1;
  }
  return candidate;
}

async function main() {
  const categorySlugCache = new Map<string, string>();
  for (const categoryName of new Set(rows.map((row) => row.category))) {
    const slug = CATEGORY_SLUG_BY_NAME[categoryName];
    if (!slug) throw new Error(`Unmapped category: ${categoryName}`);
    const category = await prisma.category.findUnique({ where: { slug } });
    if (!category) throw new Error(`Category not seeded yet: ${slug}`);
    categorySlugCache.set(categoryName, category.id);
  }

  let created = 0;
  for (const row of rows) {
    const categoryId = categorySlugCache.get(row.category);
    if (!categoryId) throw new Error(`No category id for ${row.category}`);

    const brandId = row.brand ? await ensureBrand(row.brand) : null;
    const slug = await uniqueSlug(row.name);

    const attributes: Record<string, unknown> = {
      productType: row.productType,
      puffCount: cleanPuffCount(row.puffCount),
      capacity: row.capacity,
      nicotineStrength: row.nicotineStrength,
      battery: row.battery,
      rechargeable: row.rechargeable,
      coil: row.coil,
      modesOutput: row.modesOutput,
      airflow: row.airflow,
      display: row.display,
      compatibilityNotes: row.compatibilityNotes,
      dimensions: row.dimensions,
      researchStatus: row.researchStatus,
      sourceUrl: row.sourceUrl,
    };
    const cleanedAttributes = Object.fromEntries(
      Object.entries(attributes).filter(([, value]) => value !== undefined),
    );

    const product = await prisma.product.create({
      data: {
        slug,
        name: row.name,
        categoryId,
        brandId,
        attributes: cleanedAttributes as Prisma.InputJsonValue,
        isActive: true,
      },
    });

    await prisma.productImage.create({
      data: {
        productId: product.id,
        url: DEFAULT_IMAGE_URL,
        key: DEFAULT_IMAGE_KEY,
        alt: `${row.name} (placeholder image)`,
        isPrimary: true,
        sortOrder: 0,
      },
    });

    created += 1;
  }

  console.log(`Imported ${created} products from vape_product_research.xlsx.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
