import { z } from "zod";

import { slugSchema } from "@/lib/validations/shared";

export const brandInputSchema = z.object({
  slug: slugSchema,
  name: z.string().trim().min(1),
  logoUrl: z.url().optional().or(z.literal("")),
});

export type BrandInput = z.infer<typeof brandInputSchema>;
