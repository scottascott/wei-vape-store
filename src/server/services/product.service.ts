import { prisma } from "@/lib/prisma";
import { getAttributesSchemaForCategory } from "@/lib/attribute-schemas";
import type { Prisma } from "@/generated/prisma/client";
import type { ProductInput } from "@/lib/validations/product.schema";

export type ProductFilters = {
  categorySlug?: string;
  brandSlug?: string;
  onlyActive?: boolean;
};

const productListInclude = {
  category: true,
  brand: true,
  images: { orderBy: { sortOrder: "asc" as const } },
};

export const productService = {
  list(filters: ProductFilters = {}) {
    return prisma.product.findMany({
      where: {
        isActive: filters.onlyActive === false ? undefined : true,
        category: filters.categorySlug ? { slug: filters.categorySlug } : undefined,
        brand: filters.brandSlug ? { slug: filters.brandSlug } : undefined,
      },
      include: productListInclude,
      orderBy: { createdAt: "desc" },
    });
  },

  listAllForAdmin() {
    return prisma.product.findMany({
      include: productListInclude,
      orderBy: { createdAt: "desc" },
    });
  },

  getBySlug(slug: string) {
    return prisma.product.findUnique({ where: { slug }, include: productListInclude });
  },

  getById(id: string) {
    return prisma.product.findUnique({ where: { id }, include: productListInclude });
  },

  async validateAttributes(categoryId: string, attributes: Record<string, unknown>) {
    const category = await prisma.category.findUniqueOrThrow({ where: { id: categoryId } });
    const schema = getAttributesSchemaForCategory(category.slug);
    return schema.parse(attributes) as Record<string, unknown>;
  },

  async create(input: ProductInput) {
    const attributes = await this.validateAttributes(input.categoryId, input.attributes);
    return prisma.product.create({
      data: {
        ...input,
        attributes: attributes as Prisma.InputJsonValue,
        brandId: input.brandId && input.brandId !== "none" ? input.brandId : null,
      },
      include: productListInclude,
    });
  },

  async update(id: string, input: ProductInput) {
    const attributes = await this.validateAttributes(input.categoryId, input.attributes);
    return prisma.product.update({
      where: { id },
      data: {
        ...input,
        attributes: attributes as Prisma.InputJsonValue,
        brandId: input.brandId && input.brandId !== "none" ? input.brandId : null,
      },
      include: productListInclude,
    });
  },

  setActive(id: string, isActive: boolean) {
    return prisma.product.update({ where: { id }, data: { isActive } });
  },

  async delete(id: string) {
    const product = await prisma.product.findUnique({ where: { id }, include: { images: true } });
    if (!product) return;
    await prisma.product.delete({ where: { id } });
    return product.images;
  },
};
