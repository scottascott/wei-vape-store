"use server";

import { revalidatePath } from "next/cache";

import { requireAdminSession } from "@/server/actions/require-admin-session";
import { storeInfoService } from "@/server/services/store-info.service";
import { storeInfoInputSchema } from "@/lib/validations/store-info.schema";

export async function updateStoreInfo(formData: FormData) {
  await requireAdminSession();
  const raw = Object.fromEntries(formData);
  const input = storeInfoInputSchema.parse({
    ...raw,
    hours: {
      mon: raw.mon,
      tue: raw.tue,
      wed: raw.wed,
      thu: raw.thu,
      fri: raw.fri,
      sat: raw.sat,
      sun: raw.sun,
    },
    socialLinks: {
      instagram: raw.instagram,
      facebook: raw.facebook,
      twitter: raw.twitter,
    },
  });
  await storeInfoService.upsert(input);
  revalidatePath("/admin/store-info");
  revalidatePath("/about");
}
