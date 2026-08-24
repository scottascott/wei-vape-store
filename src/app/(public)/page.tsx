import Link from "next/link";

import { BannerCarousel } from "@/components/public/banner-carousel";
import { ProductGrid } from "@/components/public/product-grid";
import { bannerService } from "@/server/services/banner.service";
import { categoryService } from "@/server/services/category.service";
import { productService } from "@/server/services/product.service";

export default async function HomePage() {
  const [banners, categories, products] = await Promise.all([
    bannerService.listActive(),
    categoryService.listAll(),
    productService.list({ onlyActive: true }),
  ]);

  const featured = products.slice(0, 8);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <BannerCarousel banners={banners} />

      <section className="mt-10">
        <h2 className="text-lg font-semibold">Shop by Category</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="flex items-center justify-center rounded-lg border bg-card p-6 text-center text-sm font-medium hover:bg-muted"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">New & Notable</h2>
          <Link href="/products" className="text-sm text-muted-foreground hover:text-foreground">
            View all
          </Link>
        </div>
        <div className="mt-4">
          <ProductGrid products={featured} />
        </div>
      </section>
    </div>
  );
}
