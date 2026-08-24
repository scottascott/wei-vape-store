import { prisma } from "@/lib/prisma";
import type { CategoryInput } from "@/lib/validations/category.schema";

export const categoryService = {
  listAll() {
    return prisma.category.findMany({ orderBy: { sortOrder: "asc" } });
  },

  getBySlug(slug: string) {
    return prisma.category.findUnique({ where: { slug } });
  },

  getById(id: string) {
    return prisma.category.findUnique({ where: { id } });
  },

  create(input: CategoryInput) {
    return prisma.category.create({ data: input });
  },

  update(id: string, input: CategoryInput) {
    return prisma.category.update({ where: { id }, data: input });
  },

  async delete(id: string) {
    const productCount = await prisma.product.count({ where: { categoryId: id } });
    if (productCount > 0) {
      throw new Error(
        `Cannot delete category with ${productCount} product(s) still assigned to it.`,
      );
    }
    return prisma.category.delete({ where: { id } });
  },
};
