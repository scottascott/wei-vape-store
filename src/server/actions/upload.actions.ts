"use server";

import { revalidatePath } from "next/cache";

import { requireAdminSession } from "@/server/actions/require-admin-session";
import { productImageService, uploadService } from "@/server/services/upload.service";
import {
  confirmProductImageInputSchema,
  generateUploadUrlInputSchema,
} from "@/lib/validations/upload.schema";

export async function generateUploadUrl(input: unknown) {
  await requireAdminSession();
  const parsed = generateUploadUrlInputSchema.parse(input);
  return uploadService.createPresignedUploadUrl(parsed);
}

export async function confirmProductImage(input: unknown) {
  await requireAdminSession();
  const parsed = confirmProductImageInputSchema.parse(input);
  const image = await productImageService.create(parsed);
  revalidatePath(`/admin/products/${parsed.productId}`);
  revalidatePath("/products");
  return image;
}

export async function deleteProductImage(imageId: string) {
  await requireAdminSession();
  await productImageService.delete(imageId);
  revalidatePath("/admin/products");
  revalidatePath("/products");
}
