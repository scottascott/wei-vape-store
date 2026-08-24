"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdminSession } from "@/server/actions/require-admin-session";
import { productService } from "@/server/services/product.service";
import { productInputSchema } from "@/lib/validations/product.schema";

function parseProductFormData(formData: FormData) {
  const raw = Object.fromEntries(formData);
  const attributesRaw = formData.get("attributes");
  let attributes: Record<string, unknown> = {};
  if (typeof attributesRaw === "string" && attributesRaw.trim().length > 0) {
    attributes = JSON.parse(attributesRaw);
  }
  return productInputSchema.parse({ ...raw, attributes });
}

export async function createProduct(formData: FormData) {
  await requireAdminSession();
  const input = parseProductFormData(formData);
  const product = await productService.create(input);
  revalidatePath("/admin/products");
  revalidatePath("/products");
  redirect(`/admin/products/${product.id}`);
}

export async function updateProduct(id: string, formData: FormData) {
  await requireAdminSession();
  const input = parseProductFormData(formData);
  await productService.update(id, input);
  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}`);
  revalidatePath("/products");
}

export async function setProductActive(id: string, isActive: boolean) {
  await requireAdminSession();
  await productService.setActive(id, isActive);
  revalidatePath("/admin/products");
  revalidatePath("/products");
}

export async function deleteProduct(id: string) {
  await requireAdminSession();
  await productService.delete(id);
  revalidatePath("/admin/products");
  revalidatePath("/products");
}
