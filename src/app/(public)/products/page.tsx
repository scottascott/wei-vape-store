import Link from "next/link";

import { PageHero } from "@/components/public/page-hero";
import { ProductsExplorer } from "@/components/public/products-explorer";
import { toProductCardData } from "@/lib/serialize-product";
import { brandService } from "@/server/services/brand.service";
import { categoryService } from "@/server/services/category.service";
import { productService } from "@/server/services/product.service";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; brand?: string }>;
}) {
  const { category, brand } = await searchParams;

  // The whole catalog is small, so we fetch it once here and let
  // ProductsExplorer handle category/brand/search filtering entirely on the
  // client — no extra round trips as the admin's data changes shape or grows
  // a bit, and filtering feels instant since there's no request in between.
  const [categories, brands, products] = await Promise.all([
    categoryService.listAll(),
    brandService.listAll(),
    productService.list({ onlyActive: true }),
  ]);

  return (
    <div>
      <PageHero
        title="Our Products"
        subtitle="We carry a wide selection of quality vape products from trusted brands."
      />

      <div className="mx-auto max-w-6xl px-4 py-8">
        <nav className="text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>{" "}
          / <span>Products</span>
        </nav>

        <div className="mt-6">
          <ProductsExplorer
            categories={categories}
            brands={brands}
            products={products.map(toProductCardData)}
            initialCategorySlug={category}
            initialBrandSlug={brand}
          />
        </div>
      </div>
    </div>
  );
}
