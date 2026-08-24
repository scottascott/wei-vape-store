"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdminSession } from "@/server/actions/require-admin-session";
import { brandService } from "@/server/services/brand.service";
import { brandInputSchema } from "@/lib/validations/brand.schema";

export async function createBrand(formData: FormData) {
  await requireAdminSession();
  const input = brandInputSchema.parse(Object.fromEntries(formData));
  await brandService.create(input);
  revalidatePath("/admin/brands");
  revalidatePath("/products");
  redirect("/admin/brands");
}

export async function updateBrand(id: string, formData: FormData) {
  await requireAdminSession();
  const input = brandInputSchema.parse(Object.fromEntries(formData));
  await brandService.update(id, input);
  revalidatePath("/admin/brands");
  revalidatePath("/products");
  redirect("/admin/brands");
}

export async function deleteBrand(id: string) {
  await requireAdminSession();
  await brandService.delete(id);
  revalidatePath("/admin/brands");
  revalidatePath("/products");
}
