import { z } from "zod";

/**
 * Parses the "true"/"false" string values submitted by our Switch components
 * (which set value="true" uncheckedValue="false"). Plain z.coerce.boolean()
 * is unsafe here because Boolean("false") === true.
 */
export const booleanFromSwitch = z
  .union([z.literal("true"), z.literal("false"), z.boolean()])
  .transform((value) => value === true || value === "true");
