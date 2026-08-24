import { z } from "zod";

/**
 * Per-category attribute shapes for Product.attributes (a jsonb column).
 * Keyed by Category.slug. Categories are admin-editable rows, not a fixed
 * enum, so any slug without a dedicated schema below falls back to
 * `genericAttributesSchema` instead of failing validation.
 *
 * Every field is optional — real vendor spec sheets are inconsistent about
 * what's published (see vape_product_research.xlsx), so the form should
 * never block a save just because a spec wasn't available.
 */
export const attributeSchemasBySlug = {
  disposable: z.object({
    productType: z.string().trim().min(1).optional(),
    puffCount: z.coerce.number().int().positive().optional(),
    capacity: z.string().trim().min(1).optional(),
    nicotineStrength: z.string().trim().min(1).optional(),
    flavor: z.string().trim().min(1).optional(),
    battery: z.string().trim().min(1).optional(),
    rechargeable: z.string().trim().min(1).optional(),
    coil: z.string().trim().min(1).optional(),
    modesOutput: z.string().trim().min(1).optional(),
    airflow: z.string().trim().min(1).optional(),
    display: z.string().trim().min(1).optional(),
    dimensions: z.string().trim().min(1).optional(),
    researchStatus: z.string().trim().min(1).optional(),
    sourceUrl: z.string().trim().min(1).optional(),
  }),
  pods: z.object({
    productType: z.string().trim().min(1).optional(),
    puffCount: z.coerce.number().int().positive().optional(),
    capacity: z.string().trim().min(1).optional(),
    nicotineStrength: z.string().trim().min(1).optional(),
    compatibleDevice: z.string().trim().min(1).optional(),
    battery: z.string().trim().min(1).optional(),
    rechargeable: z.string().trim().min(1).optional(),
    coil: z.string().trim().min(1).optional(),
    modesOutput: z.string().trim().min(1).optional(),
    airflow: z.string().trim().min(1).optional(),
    display: z.string().trim().min(1).optional(),
    compatibilityNotes: z.string().trim().min(1).optional(),
    dimensions: z.string().trim().min(1).optional(),
    researchStatus: z.string().trim().min(1).optional(),
    sourceUrl: z.string().trim().min(1).optional(),
  }),
  "e-liquid": z.object({
    capacity: z.string().trim().min(1).optional(),
    flavor: z.string().trim().min(1).optional(),
    nicotineStrength: z.string().trim().min(1).optional(),
    vgPgRatio: z.string().trim().min(1).optional(),
    researchStatus: z.string().trim().min(1).optional(),
    sourceUrl: z.string().trim().min(1).optional(),
  }),
  devices: z.object({
    productType: z.string().trim().min(1).optional(),
    capacity: z.string().trim().min(1).optional(),
    battery: z.string().trim().min(1).optional(),
    rechargeable: z.string().trim().min(1).optional(),
    coil: z.string().trim().min(1).optional(),
    modesOutput: z.string().trim().min(1).optional(),
    airflow: z.string().trim().min(1).optional(),
    display: z.string().trim().min(1).optional(),
    compatibilityNotes: z.string().trim().min(1).optional(),
    dimensions: z.string().trim().min(1).optional(),
    researchStatus: z.string().trim().min(1).optional(),
    sourceUrl: z.string().trim().min(1).optional(),
  }),
  accessories: z.object({
    material: z.string().trim().min(1).optional(),
    coil: z.string().trim().min(1).optional(),
    compatibilityNotes: z.string().trim().min(1).optional(),
    dimensions: z.string().trim().min(1).optional(),
    researchStatus: z.string().trim().min(1).optional(),
    sourceUrl: z.string().trim().min(1).optional(),
  }),
} satisfies Record<string, z.ZodType>;

export const genericAttributesSchema = z.record(z.string(), z.unknown());

export type KnownAttributeCategorySlug = keyof typeof attributeSchemasBySlug;

export function getAttributesSchemaForCategory(slug: string): z.ZodType {
  return attributeSchemasBySlug[slug as KnownAttributeCategorySlug] ?? genericAttributesSchema;
}

/**
 * Keys that are for admin/internal reference only (data provenance, not
 * customer-facing specs) — rendered in the admin form under an "Internal"
 * heading and excluded from the public product page.
 */
export const internalAttributeKeys = new Set(["researchStatus", "sourceUrl"]);

type FieldDef = { name: string; label: string; type: "text" | "number"; required?: boolean };

const disposableFields: FieldDef[] = [
  { name: "productType", label: "Product Type", type: "text" },
  { name: "puffCount", label: "Puff Count", type: "number" },
  { name: "capacity", label: "E-liquid Capacity", type: "text" },
  { name: "nicotineStrength", label: "Nicotine", type: "text" },
  { name: "flavor", label: "Flavor", type: "text" },
  { name: "battery", label: "Battery", type: "text" },
  { name: "rechargeable", label: "Rechargeable / Charging", type: "text" },
  { name: "coil", label: "Coil", type: "text" },
  { name: "modesOutput", label: "Modes / Output", type: "text" },
  { name: "airflow", label: "Airflow", type: "text" },
  { name: "display", label: "Display / Indicators", type: "text" },
  { name: "dimensions", label: "Dimensions", type: "text" },
];

const podsFields: FieldDef[] = [
  { name: "productType", label: "Product Type", type: "text" },
  { name: "puffCount", label: "Puff Count", type: "number" },
  { name: "capacity", label: "E-liquid Capacity", type: "text" },
  { name: "nicotineStrength", label: "Nicotine", type: "text" },
  { name: "compatibleDevice", label: "Compatible Device", type: "text" },
  { name: "battery", label: "Battery", type: "text" },
  { name: "rechargeable", label: "Rechargeable / Charging", type: "text" },
  { name: "coil", label: "Coil", type: "text" },
  { name: "modesOutput", label: "Modes / Output", type: "text" },
  { name: "airflow", label: "Airflow", type: "text" },
  { name: "display", label: "Display / Indicators", type: "text" },
  { name: "compatibilityNotes", label: "Compatibility / Notes", type: "text" },
  { name: "dimensions", label: "Dimensions", type: "text" },
];

const devicesFields: FieldDef[] = [
  { name: "productType", label: "Product Type", type: "text" },
  { name: "capacity", label: "Pod / Tank Capacity", type: "text" },
  { name: "battery", label: "Battery", type: "text" },
  { name: "rechargeable", label: "Rechargeable / Charging", type: "text" },
  { name: "coil", label: "Coil", type: "text" },
  { name: "modesOutput", label: "Modes / Output", type: "text" },
  { name: "airflow", label: "Airflow", type: "text" },
  { name: "display", label: "Display / Indicators", type: "text" },
  { name: "compatibilityNotes", label: "Compatibility / Notes", type: "text" },
  { name: "dimensions", label: "Dimensions", type: "text" },
];

export const attributeFieldDefinitions: Record<KnownAttributeCategorySlug, FieldDef[]> = {
  disposable: disposableFields,
  pods: podsFields,
  "e-liquid": [
    { name: "capacity", label: "Volume", type: "text" },
    { name: "flavor", label: "Flavor", type: "text" },
    { name: "nicotineStrength", label: "Nicotine", type: "text" },
    { name: "vgPgRatio", label: "VG/PG Ratio", type: "text" },
  ],
  devices: devicesFields,
  accessories: [
    { name: "material", label: "Material", type: "text" },
    { name: "coil", label: "Coil", type: "text" },
    { name: "compatibilityNotes", label: "Compatibility / Notes", type: "text" },
    { name: "dimensions", label: "Dimensions", type: "text" },
  ],
};

export const internalFieldDefinitions: FieldDef[] = [
  { name: "researchStatus", label: "Research Status", type: "text" },
  { name: "sourceUrl", label: "Source URL", type: "text" },
];
