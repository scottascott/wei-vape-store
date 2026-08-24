import { z } from "zod";

import { booleanFromSwitch } from "@/lib/validations/shared";

export const bannerInputSchema = z.object({
  title: z.string().trim().min(1),
  subtitle: z.string().trim().optional(),
  imageUrl: z.url(),
  imageKey: z.string().trim().min(1),
  linkUrl: z.url().optional().or(z.literal("")),
  sortOrder: z.coerce.number().int().default(0),
  isActive: booleanFromSwitch,
  startsAt: z.coerce.date().optional(),
  endsAt: z.coerce.date().optional(),
});

export type BannerInput = z.infer<typeof bannerInputSchema>;
