import Image from "next/image";
import Link from "next/link";

import type { Banner } from "@/generated/prisma/client";

export function BannerCarousel({ banners }: { banners: Banner[] }) {
  if (banners.length === 0) return null;

  return (
    <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
      {banners.map((banner) => {
        const content = (
          <div className="relative aspect-[16/6] w-full overflow-hidden rounded-xl bg-muted">
            <Image
              src={banner.imageUrl}
              alt={banner.title}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 to-transparent p-6 text-white">
              <p className="text-xl font-semibold">{banner.title}</p>
              {banner.subtitle && <p className="text-sm opacity-90">{banner.subtitle}</p>}
            </div>
          </div>
        );

        return (
          <div key={banner.id} className="w-full shrink-0 snap-start">
            {banner.linkUrl ? <Link href={banner.linkUrl}>{content}</Link> : content}
          </div>
        );
      })}
    </div>
  );
}
