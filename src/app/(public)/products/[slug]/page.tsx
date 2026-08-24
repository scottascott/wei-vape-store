import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AvailableInStore } from "@/components/public/available-in-store";
import { Badge } from "@/components/ui/badge";
import { productService } from "@/server/services/product.service";

function formatAttributeLabel(key: string): string {
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
    ([, value]) => value !== undefined && value !== null && value !== "",
  );
  const primaryImage = product.images.find((image) => image.isPrimary) ?? product.images[0];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <nav className="text-sm text-muted-foreground">
        <Link href="/products" className="hover:text-foreground">
          Products
        </Link>{" "}
        / <span>{product.category.name}</span>
      </nav>

      <div className="mt-4 grid gap-8 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-lg border bg-muted">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt ?? product.name}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              No image
            </div>
          )}
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

          {product.price != null && (
            <p className="mt-3 text-lg">
              {product.isOnSale && product.salePrice != null ? (
                <>
                  <span className="mr-2 text-muted-foreground line-through">
                    ${product.price.toString()}
                  </span>
                  <span className="font-semibold">${product.salePrice.toString()}</span>
                </>
              ) : (
                <>${product.price.toString()}</>
              )}
            </p>
          )}

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
                  <dt className="text-muted-foreground">{formatAttributeLabel(key)}</dt>
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
