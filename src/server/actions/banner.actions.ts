"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdminSession } from "@/server/actions/require-admin-session";
import { bannerService } from "@/server/services/banner.service";
import { bannerInputSchema } from "@/lib/validations/banner.schema";

export async function createBanner(formData: FormData) {
  await requireAdminSession();
  const input = bannerInputSchema.parse(Object.fromEntries(formData));
  await bannerService.create(input);
  revalidatePath("/admin/banners");
  revalidatePath("/");
  redirect("/admin/banners");
}

export async function updateBanner(id: string, formData: FormData) {
  await requireAdminSession();
  const input = bannerInputSchema.parse(Object.fromEntries(formData));
  await bannerService.update(id, input);
  revalidatePath("/admin/banners");
  revalidatePath("/");
  redirect("/admin/banners");
}

export async function deleteBanner(id: string) {
  await requireAdminSession();
  await bannerService.delete(id);
  revalidatePath("/admin/banners");
  revalidatePath("/");
}
