import { ProductCard } from "@/components/public/product-card";
import type { ProductCardData } from "@/lib/serialize-product";

export function ProductGrid({
  products,
  emptyMessage = "No products found in this category yet.",
}: {
  products: ProductCardData[];
  emptyMessage?: string;
}) {
  if (products.length === 0) {
    return <p className="py-16 text-center text-sm text-muted-foreground">{emptyMessage}</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
