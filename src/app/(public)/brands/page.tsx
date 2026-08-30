import Link from "next/link";

import { PageHero } from "@/components/public/page-hero";
import { brandService } from "@/server/services/brand.service";

export default async function BrandsPage() {
  const brands = await brandService.listAll();

  return (
    <div>
      <PageHero title="Brands We Carry" subtitle="A curated lineup of trusted vape brands." />

      <div className="mx-auto max-w-6xl px-4 py-10">
        {brands.length === 0 ? (
          <p className="text-sm text-muted-foreground">Brands coming soon.</p>
        ) : (<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/products?brand=${brand.slug}`}
              className="
        group flex min-h-[96px] items-center gap-4
        rounded-xl border border-neutral-200 bg-white p-4
        transition-all duration-200
        hover:-translate-y-1 hover:border-black hover:bg-black
        hover:shadow-lg
      "
            >
              <div
                className="
          flex size-12 shrink-0 items-center justify-center
          overflow-hidden rounded-lg bg-amber-50 text-amber-600
          transition-colors duration-200
          group-hover:bg-white/10 group-hover:text-amber-400
        "
              >
                {brand.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={brand.logoUrl}
                    alt={brand.name}
                    className="size-full object-contain p-2"
                  />
                ) : (
                  <span className="text-lg font-extrabold uppercase">
                    {brand.name.charAt(0)}
                  </span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-sm font-semibold leading-5 text-neutral-900 group-hover:text-white">
                  {brand.name}
                </p>

                <p className="mt-1 text-xs text-neutral-400 group-hover:text-neutral-400">
                  View products
                </p>
              </div>

              <span
                className="
          shrink-0 text-lg text-neutral-300
          transition-all duration-200
          group-hover:translate-x-1 group-hover:text-amber-400
        "
              >
                →
              </span>
            </Link>
          ))}
        </div>
        )}
      </div>
    </div>
  );
}
