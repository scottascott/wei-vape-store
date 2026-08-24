import { prisma } from "@/lib/prisma";
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

  delete(id: string) {
    return prisma.banner.delete({ where: { id } });
  },
};
