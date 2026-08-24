import { z } from "zod";

/**
 * Parses the "true"/"false" string values submitted by our Switch components
 * (which set value="true" uncheckedValue="false"). Plain z.coerce.boolean()
 * is unsafe here because Boolean("false") === true.
 */
export const booleanFromSwitch = z
  .union([z.literal("true"), z.literal("false"), z.boolean()])
  .transform((value) => value === true || value === "true");

export function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Normalizes free-typed text (spaces, mixed case, punctuation — e.g. "Elf Bar
 * BC5000") into a valid slug instead of rejecting it, since admins shouldn't
 * need to hand-format slugs themselves.
 */
export const slugSchema = z
  .string()
  .trim()
  .min(1, "Slug is required")
  .transform(slugify)
  .refine((value) => value.length > 0, "Slug must contain at least one letter or number");
