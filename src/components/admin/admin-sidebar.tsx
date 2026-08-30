import Link from "next/link";

import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/brands", label: "Brands" },
  { href: "/admin/store-info", label: "Store Info" },
];

export function AdminSidebar({ email }: { email: string }) {
  return (
    <aside className="flex w-56 shrink-0 flex-col border-r bg-muted/20 p-4">
      <p className="px-2 text-sm font-semibold">Vape Store Admin</p>
      <nav className="mt-6 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto pt-6">
        <p className="truncate px-2 text-xs text-muted-foreground">{email}</p>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/admin/login" });
          }}
        >
          <Button type="submit" variant="outline" size="sm" className="mt-2 w-full">
            Sign out
          </Button>
        </form>
      </div>
    </aside>
  );
}
