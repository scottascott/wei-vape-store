import { z } from "zod";

import { booleanFromSwitch, slugSchema } from "@/lib/validations/shared";

export const productInputSchema = z.object({
  slug: slugSchema,
  name: z.string().trim().min(1),
  description: z.string().trim().optional(),
  categoryId: z.string().trim().min(1),
  // The brand <Select> uses "none" as its sentinel for "no brand" since Base UI
  // disallows an empty-string item value; normalized to null in product.service.ts.
  brandId: z.string().trim().optional(),
  // Validated more strictly against the category's attribute shape in
  // product.service.ts, once the category is known.
  attributes: z.record(z.string(), z.unknown()).default({}),
  imageUrl: z.url().optional().or(z.literal("")),
  price: z.coerce.number().nonnegative().optional(),
  salePrice: z.coerce.number().nonnegative().optional(),
  // Blank means "no priority" (null, sorts last) — an explicit null rather than
  // undefined so clearing a previously-set priority actually clears it in the DB.
  priority: z
    .string()
    .optional()
    .transform((value) => {
      const trimmed = value?.trim();
      return trimmed ? Number(trimmed) : null;
    })
    .pipe(z.number().int().min(0).nullable()),
  isNew: booleanFromSwitch,
  isOnSale: booleanFromSwitch,
  isActive: booleanFromSwitch,
});

export type ProductInput = z.infer<typeof productInputSchema>;
