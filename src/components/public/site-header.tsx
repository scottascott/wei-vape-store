import Link from "next/link";

import { categoryService } from "@/server/services/category.service";

export async function SiteHeader() {
  const categories = await categoryService.listAll();

  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Vape Store
        </Link>
        <nav className="hidden items-center gap-5 text-sm text-muted-foreground md:flex">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="hover:text-foreground"
            >
              {category.name}
            </Link>
          ))}
          <Link href="/products" className="hover:text-foreground">
            All Products
          </Link>
          <Link href="/about" className="hover:text-foreground">
            Store Info
          </Link>
        </nav>
      </div>
    </header>
  );
}
