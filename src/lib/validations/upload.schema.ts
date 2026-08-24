import { z } from "zod";

export const generateUploadUrlInputSchema = z.object({
  fileName: z.string().trim().min(1),
  contentType: z.string().trim().min(1).startsWith("image/"),
  scope: z.enum(["product", "banner", "brand"]),
  scopeId: z.string().trim().min(1),
});

export type GenerateUploadUrlInput = z.infer<typeof generateUploadUrlInputSchema>;

export const confirmProductImageInputSchema = z.object({
  productId: z.string().trim().min(1),
  url: z.url(),
  key: z.string().trim().min(1),
  alt: z.string().trim().optional(),
  sortOrder: z.coerce.number().int().default(0),
});

export type ConfirmProductImageInput = z.infer<typeof confirmProductImageInputSchema>;
