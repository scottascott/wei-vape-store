import { randomUUID } from "node:crypto";

import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { publicUrlForKey, r2Client } from "@/lib/r2";
import type { GenerateUploadUrlInput } from "@/lib/validations/upload.schema";

const UPLOAD_URL_EXPIRY_SECONDS = 300;

function sanitizeFileName(fileName: string): string {
  return fileName.trim().toLowerCase().replace(/[^a-z0-9.\-_]+/g, "-");
}

export const uploadService = {
  async createPresignedUploadUrl(input: GenerateUploadUrlInput) {
    const key = `${input.scope}s/${input.scopeId}/${randomUUID()}-${sanitizeFileName(input.fileName)}`;

    const command = new PutObjectCommand({
      Bucket: env.R2_BUCKET_NAME,
      Key: key,
      ContentType: input.contentType,
    });

    const uploadUrl = await getSignedUrl(r2Client, command, {
      expiresIn: UPLOAD_URL_EXPIRY_SECONDS,
    });

    return { uploadUrl, key, publicUrl: publicUrlForKey(key) };
  },

  async deleteObject(key: string) {
    try {
      await r2Client.send(new DeleteObjectCommand({ Bucket: env.R2_BUCKET_NAME, Key: key }));
    } catch {
      // Best-effort cleanup — a stray object in R2 is not worth failing the request over.
    }
  },
};

export const productImageService = {
  create(input: { productId: string; url: string; key: string; alt?: string; sortOrder: number }) {
    return prisma.productImage.create({ data: input });
  },

  async delete(imageId: string) {
    const image = await prisma.productImage.findUnique({ where: { id: imageId } });
    if (!image) return;
    await prisma.productImage.delete({ where: { id: imageId } });
    await uploadService.deleteObject(image.key);
  },
};
