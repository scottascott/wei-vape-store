import type { Prisma } from "@/generated/prisma/client";

type ProductWithRelations = Prisma.ProductGetPayload<{
  include: { category: true; brand: true };
}>;

/** Plain, JSON-serializable shape for rendering a product card/grid. */
export type ProductCardData = {
  id: string;
  slug: string;
  name: string;
  imageUrl: string | null;
  price: string | null;
  salePrice: string | null;
  isNew: boolean;
  isOnSale: boolean;
  category: { slug: string; name: string };
  brand: { slug: string; name: string } | null;
};

export function toProductCardData(product: ProductWithRelations): ProductCardData {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    imageUrl: product.imageUrl,
    price: product.price?.toString() ?? null,
    salePrice: product.salePrice?.toString() ?? null,
    isNew: product.isNew,
    isOnSale: product.isOnSale,
    category: { slug: product.category.slug, name: product.category.name },
    brand: product.brand ? { slug: product.brand.slug, name: product.brand.name } : null,
  };
}
