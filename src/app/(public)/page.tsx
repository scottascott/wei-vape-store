import { ShieldCheck, ShoppingBag, Sparkles, Store } from "lucide-react";
import Link from "next/link";

import { BrandMarquee } from "@/components/public/brand-marquee";
import { ProductGrid } from "@/components/public/product-grid";
import { SectionHeading } from "@/components/public/section-heading";
import { getCategoryIcon } from "@/lib/category-icons";
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

  const featured = products.slice(0, 8);

  return (
    <div>
      <section className="bg-black text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">
            WEI&apos;S <span className="text-amber-400">VAPE</span>
          </h1>
          <p className="mt-2 text-lg font-medium tracking-[0.15em] text-amber-400">
            SPECIALTY VAPE STORE
          </p>
          <p className="mt-4 max-w-xl text-white/70">
            We offer a wide selection of quality vape products from top brands.
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
                className="group flex flex-col items-center gap-2 rounded-lg border p-5 text-center transition-colors hover:border-amber-400 hover:bg-amber-50/50 dark:hover:bg-amber-500/5"
              >
                <Icon className="size-7 text-amber-500" />
                <p className="text-sm font-semibold">{category.name}</p>
                {category.description && (
                  <p className="line-clamp-2 text-xs text-muted-foreground">
                    {category.description}
                  </p>
                )}
              </Link>
            );
          })}
          <Link
            href="/contact"
            className="group flex flex-col items-center gap-2 rounded-lg border border-dashed p-5 text-center transition-colors hover:border-amber-400"
          >
            <ShoppingBag className="size-7 text-amber-500" />
            <p className="text-sm font-semibold">More In Store</p>
            <p className="line-clamp-2 text-xs text-muted-foreground">
              Visit us for our full selection.
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
