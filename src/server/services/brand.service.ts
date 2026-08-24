import { prisma } from "@/lib/prisma";
import type { BrandInput } from "@/lib/validations/brand.schema";

export const brandService = {
  listAll() {
    return prisma.brand.findMany({ orderBy: { name: "asc" } });
  },

  getBySlug(slug: string) {
    return prisma.brand.findUnique({ where: { slug } });
  },

  getById(id: string) {
    return prisma.brand.findUnique({ where: { id } });
  },

  create(input: BrandInput) {
    return prisma.brand.create({ data: { ...input, logoUrl: input.logoUrl || null } });
  },

  update(id: string, input: BrandInput) {
    return prisma.brand.update({
      where: { id },
      data: { ...input, logoUrl: input.logoUrl || null },
    });
  },

  async delete(id: string) {
    await prisma.product.updateMany({ where: { brandId: id }, data: { brandId: null } });
    return prisma.brand.delete({ where: { id } });
  },
};
