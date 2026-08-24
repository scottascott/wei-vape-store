import { prisma } from "@/lib/prisma";
import { r2Client } from "@/lib/r2";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { env } from "@/lib/env";
import type { BannerInput } from "@/lib/validations/banner.schema";

export const bannerService = {
  listAll() {
    return prisma.banner.findMany({ orderBy: { sortOrder: "asc" } });
  },

  listActive() {
    const now = new Date();
    return prisma.banner.findMany({
      where: {
        isActive: true,
        AND: [
          { OR: [{ startsAt: null }, { startsAt: { lte: now } }] },
          { OR: [{ endsAt: null }, { endsAt: { gte: now } }] },
        ],
      },
      orderBy: { sortOrder: "asc" },
    });
  },

  getById(id: string) {
    return prisma.banner.findUnique({ where: { id } });
  },

  create(input: BannerInput) {
    return prisma.banner.create({ data: { ...input, linkUrl: input.linkUrl || null } });
  },

  update(id: string, input: BannerInput) {
    return prisma.banner.update({
      where: { id },
      data: { ...input, linkUrl: input.linkUrl || null },
    });
  },

  async delete(id: string) {
    const banner = await prisma.banner.findUnique({ where: { id } });
    if (!banner) return;
    await prisma.banner.delete({ where: { id } });
    try {
      await r2Client.send(
        new DeleteObjectCommand({ Bucket: env.R2_BUCKET_NAME, Key: banner.imageKey }),
      );
    } catch {
      // Best-effort: the DB row is already gone even if the R2 object delete fails.
    }
  },
};
