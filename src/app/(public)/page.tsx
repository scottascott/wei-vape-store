import { ShieldCheck, ShoppingBag, Sparkles, Store } from "lucide-react";
import Link from "next/link";

import { BrandMarquee } from "@/components/public/brand-marquee";
import { ProductGrid } from "@/components/public/product-grid";
import { SectionHeading } from "@/components/public/section-heading";
import { getCategoryIcon } from "@/lib/category-icons";
import { toProductCardData } from "@/lib/serialize-product";
import { brandService } from "@/server/services/brand.service";
import { categoryService } from "@/server/services/category.service";
import { productService } from "@/server/services/product.service";

const FEATURE_BADGES = [
  { icon: Store, label: "Specialty Vape Store", detail: "In-store only" },
  { icon: ShieldCheck, label: "19+ Only", detail: "ID required for entry" },
  { icon: Sparkles, label: "Quality Products", detail: "Trusted brands you can rely on" },
];

export default async function HomePage() {
  const [categories, brands, products] = await Promise.all([
    categoryService.listAll(),
    brandService.listAll(),
    productService.list({ onlyActive: true }),
  ]);

  const featured = products.slice(0, 8).map(toProductCardData);

  return (
    <div>
      <section className="bg-black text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl">
            QUALITY PRODUCTS
            <span className="block text-amber-400">LOCAL SERVICE</span>
          </h1>

          <p className="mt-4 max-w-xl text-base leading-7 text-white/70 sm:text-lg">
            Explore trusted vape brands, devices, and accessories—all available in store.
          </p>

          <div className="mt-8 flex flex-wrap gap-6 border-t border-white/10 pt-6">
            {FEATURE_BADGES.map((badge) => (
              <div key={badge.label} className="flex items-start gap-2.5">
                <badge.icon className="mt-0.5 size-5 shrink-0 text-amber-400" />
                <div>
                  <p className="text-sm font-semibold">{badge.label}</p>
                  <p className="text-xs text-white/50">{badge.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <SectionHeading className="mb-6">Our Products</SectionHeading>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => {
            const Icon = getCategoryIcon(category.slug);
            return (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="
                  group relative flex min-h-[132px] flex-col items-center justify-center
                  rounded-xl border border-neutral-200 bg-white px-4 py-5 text-center
                  transition-all duration-200
                  hover:-translate-y-1 hover:border-amber-400 hover:shadow-lg
                "
              >
                <span
                  className="
                    flex size-11 items-center justify-center rounded-lg
                    bg-amber-50 text-amber-500
                    transition-colors duration-200
                    group-hover:bg-black group-hover:text-amber-400
                  "
                >
                  <Icon className="size-6" />
                </span>

                <p className="mt-3 text-sm font-semibold text-neutral-900">
                  {category.name}
                </p>

                {category.description && (
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-neutral-500">
                    {category.description}
                  </p>
                )}
              </Link>
            );
          })}
          <Link
            href="/contact"
            className="
              group relative flex min-h-[132px] flex-col items-center justify-center
              rounded-xl border border-neutral-200 bg-white px-4 py-5 text-center
              transition-all duration-200
              hover:-translate-y-1 hover:border-amber-400 hover:shadow-lg
            "
          >
            <span
              className="
                flex size-11 items-center justify-center rounded-lg
                bg-amber-50 text-amber-500
                transition-colors duration-200
                group-hover:bg-black group-hover:text-amber-400
              "
            >
              <ShoppingBag className="size-6" />
            </span>

            <p className="mt-3 text-sm font-semibold text-neutral-900">
              More In Store
            </p>

          </Link>
        </div>
      </section>

      {brands.length > 0 && (
        <section className="bg-black py-10 text-white">
          <p className="text-center text-xs font-semibold tracking-[0.2em] text-white/50">
            BRANDS WE CARRY
          </p>
          <div className="mt-6">
            <BrandMarquee brands={brands} />
          </div>
        </section>
      )}

      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-12">
          <div className="flex items-center justify-between">
            <SectionHeading>New & Notable</SectionHeading>
            <Link href="/products" className="text-sm text-muted-foreground hover:text-foreground">
              View all
            </Link>
          </div>
          <div className="mt-6">
            <ProductGrid products={featured} />
          </div>
        </section>
      )}
    </div>
  );
}
