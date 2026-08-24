import { z } from "zod";

export const brandInputSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only"),
  name: z.string().trim().min(1),
  logoUrl: z.url().optional().or(z.literal("")),
});

export type BrandInput = z.infer<typeof brandInputSchema>;
