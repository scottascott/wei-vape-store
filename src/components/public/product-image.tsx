import Image from "next/image";

import { cn } from "@/lib/utils";

export function ProductImage({
  url,
  alt,
  sizes,
  priority,
  className,
}: {
  url: string | undefined | null;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  if (!url) {
    return (
      <Image
        src="/product-placeholder.webp"
        alt={alt}
        fill
        sizes={sizes}
        className={cn("object-cover", className)}
        priority={priority}
      />
    );
  }

  // Product photos are plain admin-entered links (any external host), so they
  // can't go through next/image's optimizer without allow-listing every
  // possible domain — a plain <img> works with any URL.
  return (
    // eslint-disable-next-line @next/next/no-img-element -- arbitrary external URL
    <img
      src={url}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      className={cn("absolute inset-0 h-full w-full object-cover", className)}
    />
  );
}
