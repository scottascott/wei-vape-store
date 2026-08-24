import Image from "next/image";
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
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {brands.map((brand) => (
              <Link
                key={brand.id}
                href={`/products?brand=${brand.slug}`}
                className="flex flex-col items-center justify-center gap-3 rounded-lg border p-6 text-center transition-colors hover:border-amber-400 hover:bg-amber-50/50 dark:hover:bg-amber-500/5"
              >
                {brand.logoUrl ? (
                  <div className="relative h-10 w-full">
                    <Image src={brand.logoUrl} alt={brand.name} fill className="object-contain" />
                  </div>
                ) : (
                  <p className="text-lg font-bold tracking-tight">{brand.name}</p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
