import Image from "next/image";

import { cn } from "@/lib/utils";

export function ProductImage({
  url,
  alt,
  sizes,
  priority,
  className,
}: {
  url: string | undefined;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <Image
      src={url ?? "/product-placeholder.webp"}
      alt={alt}
      fill
      sizes={sizes}
      className={cn("object-cover", className)}
      priority={priority}
    />
  );
}
