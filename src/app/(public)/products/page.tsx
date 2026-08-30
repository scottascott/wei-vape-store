import Link from "next/link";

import { PageHero } from "@/components/public/page-hero";
import { ProductGrid } from "@/components/public/product-grid";
import { SectionHeading } from "@/components/public/section-heading";
import { getCategoryIcon } from "@/lib/category-icons";
import { cn } from "@/lib/utils";
import { brandService } from "@/server/services/brand.service";
import { categoryService } from "@/server/services/category.service";
import { productService } from "@/server/services/product.service";

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  disposable: "Convenient, ready-to-use and available in a variety of flavours.",
  pods: "Closed and open pod systems with great flavour.",
  "e-liquid": "Freebase and nic salt e-liquids from top brands.",
  devices: "Mods, kits and starter sets.",
  accessories: "Coils, pods, tanks and more.",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; brand?: string }>;
}) {
  const { category, brand } = await searchParams;

  const [categories, brands] = await Promise.all([
    categoryService.listAll(),
    brandService.listAll(),
  ]);

  const activeBrand = brand ? brands.find((b) => b.slug === brand) : undefined;
  const isFiltered = Boolean(category || brand);

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

        <div className="mt-6 grid gap-8 lg:grid-cols-[220px_1fr]">
          <aside className="space-y-6">
            <div>
              <p className="mb-3 text-xs font-semibold tracking-wide text-muted-foreground">
                PRODUCT CATEGORIES
              </p>
              <nav className="flex flex-col gap-1">
                {categories.map((cat) => {
                  const Icon = getCategoryIcon(cat.slug);
                  const isActive = category === cat.slug;
                  return (
                    <Link
                      key={cat.id}
                      href={`/products?category=${cat.slug}`}
                      className={cn(
                        "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium",
                        isActive
                          ? "bg-black text-white"
                          : "text-foreground hover:bg-muted",
                      )}
                    >
                      <Icon className="size-4" />
                      {cat.name}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="rounded-lg border bg-muted/30 p-4">
              <p className="text-sm font-semibold text-amber-600">Available In Store</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Products and flavours may vary. Please visit us for current availability.
              </p>
            </div>
          </aside>

          <div>
            {isFiltered ? (
              <FilteredProducts
                categorySlug={category}
                brandSlug={brand}
                categoryName={categories.find((c) => c.slug === category)?.name}
                brandName={activeBrand?.name}
              />
            ) : (
              <div className="flex flex-col gap-12">
                {categories.map((cat) => (
                  <CategorySection key={cat.id} categorySlug={cat.slug} categoryName={cat.name} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

async function FilteredProducts({
  categorySlug,
  brandSlug,
  categoryName,
  brandName,
}: {
  categorySlug?: string;
  brandSlug?: string;
  categoryName?: string;
  brandName?: string;
}) {
  const products = await productService.list({
    onlyActive: true,
    categorySlug,
    brandSlug,
  });

  const heading = [categoryName, brandName].filter(Boolean).join(" · ") || "All Products";

  return (
    <div>
      <div className="flex items-center justify-between">
        <SectionHeading>{heading}</SectionHeading>
        <Link href="/products" className="text-sm text-muted-foreground hover:text-foreground">
          Clear filter
        </Link>
      </div>
      <div className="mt-6">
        <ProductGrid products={products} />
      </div>
    </div>
  );
}

async function CategorySection({
  categorySlug,
  categoryName,
}: {
  categorySlug: string;
  categoryName: string;
}) {
  const products = await productService.list({ onlyActive: true, categorySlug });
  if (products.length === 0) return null;

  return (
    <section>
      <div className="flex items-end justify-between">
        <div>
          <SectionHeading>{categoryName}</SectionHeading>
          {CATEGORY_DESCRIPTIONS[categorySlug] && (
            <p className="mt-2 text-sm text-muted-foreground">
              {CATEGORY_DESCRIPTIONS[categorySlug]}
            </p>
          )}
        </div>
        <Link
          href={`/products?category=${categorySlug}`}
          className="shrink-0 text-sm font-medium text-amber-600 hover:underline"
        >
          View all
        </Link>
      </div>
      <div className="mt-4">
        <ProductGrid products={products.slice(0, 4)} />
      </div>
    </section>
  );
}
