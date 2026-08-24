import { z } from "zod";

import { slugSchema } from "@/lib/validations/shared";

export const categoryInputSchema = z.object({
  slug: slugSchema,
  name: z.string().trim().min(1),
  description: z.string().trim().optional(),
  sortOrder: z.coerce.number().int().default(0),
});

export type CategoryInput = z.infer<typeof categoryInputSchema>;
