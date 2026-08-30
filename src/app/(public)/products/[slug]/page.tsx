import Link from "next/link";
import { notFound } from "next/navigation";

import { AvailableInStore } from "@/components/public/available-in-store";
import { ProductImage } from "@/components/public/product-image";
import { Badge } from "@/components/ui/badge";
import {
  attributeFieldDefinitions,
  internalAttributeKeys,
  type KnownAttributeCategorySlug,
} from "@/lib/attribute-schemas";
import { productService } from "@/server/services/product.service";

function formatAttributeLabel(key: string, categorySlug: string): string {
  const definitions =
    categorySlug in attributeFieldDefinitions
      ? attributeFieldDefinitions[categorySlug as KnownAttributeCategorySlug]
      : [];
  const known = definitions.find((field) => field.name === key);
  if (known) return known.label;

  return key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/^./, (char) => char.toUpperCase());
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await productService.getBySlug(slug);

  if (!product || !product.isActive) {
    notFound();
  }

  const attributes = Object.entries(product.attributes as Record<string, unknown>).filter(
    ([key, value]) =>
      value !== undefined && value !== null && value !== "" && !internalAttributeKeys.has(key),
  );
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <span aria-hidden="true">/</span>
        <Link href="/products" className="hover:text-foreground">
          Products
        </Link>
        <span aria-hidden="true">/</span>
        <Link
          href={`/products?category=${product.category.slug}`}
          className="hover:text-foreground"
        >
          {product.category.name}
        </Link>
      </nav>

      <div className="mt-4 grid gap-8 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-lg border bg-muted">
          <ProductImage
            url={product.imageUrl}
            alt={product.name}
            sizes="(min-width: 768px) 50vw, 100vw"
            priority
          />
        </div>

        <div>
          <div className="flex gap-1.5">
            {product.isNew && <Badge>New</Badge>}
            {product.isOnSale && <Badge variant="destructive">Sale</Badge>}
          </div>
          {product.brand && (
            <p className="mt-2 text-sm text-muted-foreground">{product.brand.name}</p>
          )}
          <h1 className="mt-1 text-2xl font-semibold">{product.name}</h1>

          <div className="mt-4">
            <AvailableInStore />
          </div>

          {product.description && (
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </p>
          )}

          {attributes.length > 0 && (
            <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
              {attributes.map(([key, value]) => (
                <div key={key} className="contents">
                  <dt className="text-muted-foreground">
                    {formatAttributeLabel(key, product.category.slug)}
                  </dt>
                  <dd>{String(value)}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>
    </div>
  );
}
