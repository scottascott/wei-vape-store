import { z } from "zod";

import { booleanFromSwitch } from "@/lib/validations/shared";

export const productInputSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only"),
  name: z.string().trim().min(1),
  description: z.string().trim().optional(),
  categoryId: z.string().trim().min(1),
  // The brand <Select> uses "none" as its sentinel for "no brand" since Base UI
  // disallows an empty-string item value; normalized to null in product.service.ts.
  brandId: z.string().trim().optional(),
  // Validated more strictly against the category's attribute shape in
  // product.service.ts, once the category is known.
  attributes: z.record(z.string(), z.unknown()).default({}),
  price: z.coerce.number().nonnegative().optional(),
  salePrice: z.coerce.number().nonnegative().optional(),
  isNew: booleanFromSwitch,
  isOnSale: booleanFromSwitch,
  isActive: booleanFromSwitch,
});

export type ProductInput = z.infer<typeof productInputSchema>;
