import Link from "next/link";

import { ProductImage } from "@/components/public/product-image";
import { Badge } from "@/components/ui/badge";
import type { Prisma } from "@/generated/prisma/client";

type ProductWithRelations = Prisma.ProductGetPayload<{
  include: { category: true; brand: true };
}>;

export function ProductCard({ product }: { product: ProductWithRelations }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-square bg-muted">
        <ProductImage
          url={product.imageUrl}
          alt={product.name}
          sizes="(min-width: 768px) 25vw, 50vw"
          className="transition-transform group-hover:scale-105"
        />
        <div className="absolute left-2 top-2 flex gap-1.5">
          {product.isNew && <Badge>New</Badge>}
          {product.isOnSale && <Badge variant="destructive">Sale</Badge>}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        {product.brand && (
          <p className="text-xs text-muted-foreground">{product.brand.name}</p>
        )}
        <p className="text-sm font-medium leading-snug">{product.name}</p>
        {product.price != null && (
          <p className="mt-1 text-sm text-muted-foreground">
            {product.isOnSale && product.salePrice != null ? (
              <>
                <span className="mr-1.5 line-through">${product.price.toString()}</span>
                <span className="font-medium text-foreground">
                  ${product.salePrice.toString()}
                </span>
              </>
            ) : (
              <>${product.price.toString()}</>
            )}
          </p>
        )}
      </div>
    </Link>
  );
}
