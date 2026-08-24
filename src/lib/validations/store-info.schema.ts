import { z } from "zod";

export const storeHoursSchema = z.object({
  mon: z.string().trim().optional(),
  tue: z.string().trim().optional(),
  wed: z.string().trim().optional(),
  thu: z.string().trim().optional(),
  fri: z.string().trim().optional(),
  sat: z.string().trim().optional(),
  sun: z.string().trim().optional(),
});

export const socialLinksSchema = z.object({
  instagram: z.url().optional().or(z.literal("")),
  facebook: z.url().optional().or(z.literal("")),
  twitter: z.url().optional().or(z.literal("")),
});

export const storeInfoInputSchema = z.object({
  name: z.string().trim().min(1),
  addressLine: z.string().trim().min(1),
  city: z.string().trim().min(1),
  state: z.string().trim().min(1),
  zip: z.string().trim().min(1),
  phone: z.string().trim().min(1),
  email: z.email().optional().or(z.literal("")),
  hours: storeHoursSchema,
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  mapEmbedUrl: z.url().optional().or(z.literal("")),
  socialLinks: socialLinksSchema.optional(),
});

export type StoreInfoInput = z.infer<typeof storeInfoInputSchema>;
