import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [productCount, categoryCount, brandCount, bannerCount] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.brand.count(),
    prisma.banner.count(),
  ]);

  const cards = [
    { label: "Products", count: productCount, href: "/admin/products" },
    { label: "Categories", count: categoryCount, href: "/admin/categories" },
    { label: "Brands", count: brandCount, href: "/admin/brands" },
    { label: "Banners", count: bannerCount, href: "/admin/banners" },
  ];

  return (
    <div>
      <h1 className="text-xl font-semibold">Dashboard</h1>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {cards.map((card) => (
          <Link key={card.href} href={card.href}>
            <Card className="hover:bg-muted/50">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold">{card.count}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
