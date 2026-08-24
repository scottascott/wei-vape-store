import { z } from "zod";

/**
 * Per-category attribute shapes for Product.attributes (a jsonb column).
 * Keyed by Category.slug. Categories are admin-editable rows, not a fixed
 * enum, so any slug without a dedicated schema below falls back to
 * `genericAttributesSchema` instead of failing validation.
 */
export const attributeSchemasBySlug = {
  disposable: z.object({
    puffCount: z.coerce.number().int().positive().optional(),
    nicotineStrength: z.string().trim().min(1).optional(),
    flavor: z.string().trim().min(1).optional(),
  }),
  pods: z.object({
    podCapacityMl: z.coerce.number().positive().optional(),
    nicotineStrength: z.string().trim().min(1).optional(),
    compatibleDevice: z.string().trim().min(1).optional(),
  }),
  "e-liquid": z.object({
    volumeMl: z.coerce.number().positive().optional(),
    flavor: z.string().trim().min(1).optional(),
    nicotineStrength: z.string().trim().min(1).optional(),
    vgPgRatio: z.string().trim().min(1).optional(),
  }),
  devices: z.object({
    batteryCapacityMah: z.coerce.number().positive().optional(),
    wattageRange: z.string().trim().min(1).optional(),
    tankCapacityMl: z.coerce.number().positive().optional(),
  }),
  accessories: z.object({
    material: z.string().trim().min(1).optional(),
    compatibleWith: z.string().trim().min(1).optional(),
  }),
} satisfies Record<string, z.ZodType>;

export const genericAttributesSchema = z.record(z.string(), z.unknown());

export type KnownAttributeCategorySlug = keyof typeof attributeSchemasBySlug;

export function getAttributesSchemaForCategory(slug: string): z.ZodType {
  return attributeSchemasBySlug[slug as KnownAttributeCategorySlug] ?? genericAttributesSchema;
}

export const attributeFieldDefinitions: Record<
  KnownAttributeCategorySlug,
  Array<{ name: string; label: string; type: "text" | "number"; required?: boolean }>
> = {
  disposable: [
    { name: "puffCount", label: "Puff Count", type: "number" },
    { name: "nicotineStrength", label: "Nicotine Strength", type: "text" },
    { name: "flavor", label: "Flavor", type: "text" },
  ],
  pods: [
    { name: "podCapacityMl", label: "Pod Capacity (ml)", type: "number" },
    { name: "nicotineStrength", label: "Nicotine Strength", type: "text" },
    { name: "compatibleDevice", label: "Compatible Device", type: "text" },
  ],
  "e-liquid": [
    { name: "volumeMl", label: "Volume (ml)", type: "number" },
    { name: "flavor", label: "Flavor", type: "text" },
    { name: "nicotineStrength", label: "Nicotine Strength", type: "text" },
    { name: "vgPgRatio", label: "VG/PG Ratio", type: "text" },
  ],
  devices: [
    { name: "batteryCapacityMah", label: "Battery Capacity (mAh)", type: "number" },
    { name: "wattageRange", label: "Wattage Range", type: "text" },
    { name: "tankCapacityMl", label: "Tank Capacity (ml)", type: "number" },
  ],
  accessories: [
    { name: "material", label: "Material", type: "text" },
    { name: "compatibleWith", label: "Compatible With", type: "text" },
  ],
};
