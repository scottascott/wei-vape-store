"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdminSession } from "@/server/actions/require-admin-session";
import { categoryService } from "@/server/services/category.service";
import { categoryInputSchema } from "@/lib/validations/category.schema";

export async function createCategory(formData: FormData) {
  await requireAdminSession();
  const input = categoryInputSchema.parse(Object.fromEntries(formData));
  await categoryService.create(input);
  revalidatePath("/admin/categories");
  revalidatePath("/products");
  redirect("/admin/categories");
}

export async function updateCategory(id: string, formData: FormData) {
  await requireAdminSession();
  const input = categoryInputSchema.parse(Object.fromEntries(formData));
  await categoryService.update(id, input);
  revalidatePath("/admin/categories");
  revalidatePath("/products");
  redirect("/admin/categories");
}

export async function deleteCategory(id: string) {
  await requireAdminSession();
  await categoryService.delete(id);
  revalidatePath("/admin/categories");
  revalidatePath("/products");
}
