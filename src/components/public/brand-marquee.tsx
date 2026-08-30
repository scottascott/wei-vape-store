import Link from "next/link";

import type { Brand } from "@/generated/prisma/client";

export function BrandMarquee({ brands }: { brands: Brand[] }) {
  // Duration scales with the list length so the apparent scroll speed stays
  // consistent whether there are 5 brands or 50.
  const durationSeconds = Math.max(15, brands.length * 3);

  return (
    <div
      className="marquee-paused-on-hover relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]"
      role="list"
      aria-label="Brands we carry"
    >
      <div
        className="animate-marquee flex w-max items-center gap-10"
        style={{ animationDuration: `${durationSeconds}s` }}
      >
        {[0, 1].map((copy) => (
          <div key={copy} aria-hidden={copy === 1} className="flex shrink-0 items-center gap-10 pr-10">
            {brands.map((brand) => (
              <Link
                key={brand.id}
                href={`/products?brand=${brand.slug}`}
                className="text-lg font-bold tracking-tight whitespace-nowrap text-white/70 transition-colors hover:text-amber-400"
              >
                {brand.name}
              </Link>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
