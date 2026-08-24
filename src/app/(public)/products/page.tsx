import Link from "next/link";

import { ProductGrid } from "@/components/public/product-grid";
import { cn } from "@/lib/utils";
import { categoryService } from "@/server/services/category.service";
import { productService } from "@/server/services/product.service";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

  const [categories, products] = await Promise.all([
    categoryService.listAll(),
    productService.list({ onlyActive: true, categorySlug: category }),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Products</h1>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href="/products"
          className={cn(
            "rounded-full border px-3 py-1.5 text-sm",
            !category ? "bg-foreground text-background" : "hover:bg-muted",
          )}
        >
          All
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/products?category=${cat.slug}`}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm",
              category === cat.slug ? "bg-foreground text-background" : "hover:bg-muted",
            )}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      <div className="mt-6">
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
