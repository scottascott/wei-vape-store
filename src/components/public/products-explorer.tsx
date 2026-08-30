"use client";

import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { ProductGrid } from "@/components/public/product-grid";
import { SectionHeading } from "@/components/public/section-heading";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Brand, Category } from "@/generated/prisma/client";
import { getCategoryIcon } from "@/lib/category-icons";
import type { ProductCardData } from "@/lib/serialize-product";
import { cn } from "@/lib/utils";

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  disposable: "Convenient, ready-to-use and available in a variety of flavours.",
  pods: "Closed and open pod systems with great flavour.",
  "e-liquid": "Freebase and nic salt e-liquids from top brands.",
  devices: "Mods, kits and starter sets.",
  accessories: "Coils, pods, tanks and more.",
};

const ALL_BRANDS_VALUE = "all";

/** Keeps the URL shareable/bookmarkable without ever triggering a Next.js
 * navigation (and thus a server refetch) — filtering here is purely client-side
 * over the one product list this component was handed on first render. */
function syncUrl(categorySlug: string | undefined, brandSlug: string | undefined) {
  const params = new URLSearchParams();
  if (categorySlug) params.set("category", categorySlug);
  if (brandSlug) params.set("brand", brandSlug);
  const qs = params.toString();
  const url = qs ? `/products?${qs}` : "/products";
  window.history.replaceState(null, "", url);
}

export function ProductsExplorer({
  categories,
  brands,
  products,
  initialCategorySlug,
  initialBrandSlug,
}: {
  categories: Category[];
  brands: Brand[];
  products: ProductCardData[];
  initialCategorySlug?: string;
  initialBrandSlug?: string;
}) {
  const [categorySlug, setCategorySlug] = useState(initialCategorySlug);
  const [brandSlug, setBrandSlug] = useState(initialBrandSlug);
  const [search, setSearch] = useState("");

  useEffect(() => {
    syncUrl(categorySlug, brandSlug);
  }, [categorySlug, brandSlug]);

  const isFiltered = Boolean(categorySlug || brandSlug || search.trim());

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return products.filter((product) => {
      if (categorySlug && product.category.slug !== categorySlug) return false;
      if (brandSlug && product.brand?.slug !== brandSlug) return false;
      if (query) {
        const haystack = `${product.name} ${product.brand?.name ?? ""}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });
  }, [products, categorySlug, brandSlug, search]);

  const byCategory = useMemo(() => {
    const map = new Map<string, ProductCardData[]>();
    for (const category of categories) map.set(category.slug, []);
    for (const product of products) {
      map.get(product.category.slug)?.push(product);
    }
    return map;
  }, [products, categories]);

  const activeCategoryName = categories.find((c) => c.slug === categorySlug)?.name;
  const activeBrandName = brands.find((b) => b.slug === brandSlug)?.name;
  const filterHeadingParts = [activeCategoryName, activeBrandName].filter(Boolean);
  const heading =
    filterHeadingParts.length > 0
      ? filterHeadingParts.join(" · ")
      : search.trim()
        ? `Results for "${search.trim()}"`
        : "All Products";

  function clearFilters() {
    setCategorySlug(undefined);
    setBrandSlug(undefined);
    setSearch("");
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
      <aside className="space-y-6">
        <div>
          <p className="mb-3 text-xs font-semibold tracking-wide text-muted-foreground">
            PRODUCT CATEGORIES
          </p>
          <nav className="flex flex-col gap-1">
            {categories.map((cat) => {
              const Icon = getCategoryIcon(cat.slug);
              const isActive = categorySlug === cat.slug;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategorySlug(isActive ? undefined : cat.slug)}
                  className={cn(
                    "flex items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm font-medium",
                    isActive ? "bg-black text-white" : "text-foreground hover:bg-muted",
                  )}
                >
                  <Icon className="size-4" />
                  {cat.name}
                </button>
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
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products or brands..."
              className="pl-9"
            />
          </div>
          <Select
            value={brandSlug ?? ALL_BRANDS_VALUE}
            onValueChange={(value) =>
              setBrandSlug(value === ALL_BRANDS_VALUE ? undefined : (value ?? undefined))
            }
            items={{
              [ALL_BRANDS_VALUE]: "All Brands",
              ...Object.fromEntries(brands.map((b) => [b.slug, b.name])),
            }}
          >
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_BRANDS_VALUE}>All Brands</SelectItem>
              {brands.map((brand) => (
                <SelectItem key={brand.id} value={brand.slug}>
                  {brand.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mt-6">
          {isFiltered ? (
            <div>
              <div className="flex items-center justify-between">
                <SectionHeading>{heading}</SectionHeading>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Clear filter
                </button>
              </div>
              <div className="mt-6">
                <ProductGrid
                  products={filtered}
                  emptyMessage="No products match your search."
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-12">
              {categories.map((cat) => {
                const categoryProducts = byCategory.get(cat.slug) ?? [];
                if (categoryProducts.length === 0) return null;
                return (
                  <section key={cat.id}>
                    <div className="flex items-end justify-between">
                      <div>
                        <SectionHeading>{cat.name}</SectionHeading>
                        {CATEGORY_DESCRIPTIONS[cat.slug] && (
                          <p className="mt-2 text-sm text-muted-foreground">
                            {CATEGORY_DESCRIPTIONS[cat.slug]}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setCategorySlug(cat.slug)}
                        className="shrink-0 text-sm font-medium text-amber-600 hover:underline"
                      >
                        View all
                      </button>
                    </div>
                    <div className="mt-4">
                      <ProductGrid products={categoryProducts.slice(0, 4)} />
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
