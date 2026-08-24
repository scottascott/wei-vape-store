import { MapPin, Phone, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { categoryService } from "@/server/services/category.service";
import { storeInfoService } from "@/server/services/store-info.service";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/brands", label: "Brands" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

export async function SiteHeader() {
  const [categories, storeInfo] = await Promise.all([
    categoryService.listAll(),
    storeInfoService.get(),
  ]);

  return (
    <header className="bg-black text-white">
      <div className="hidden border-b border-white/10 sm:block">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-2 text-xs text-white/70">
          <p className="flex items-center gap-1.5">
            <ShieldCheck className="size-3.5 text-amber-400" />
            19+ ONLY. ID REQUIRED FOR ENTRY.
          </p>
          <div className="flex items-center gap-6">
            {storeInfo && (
              <p className="flex items-center gap-1.5">
                <MapPin className="size-3.5 text-amber-400" />
                {storeInfo.addressLine}, {storeInfo.city}, {storeInfo.state}
              </p>
            )}
            {storeInfo?.phone && (
              <a href={`tel:${storeInfo.phone}`} className="flex items-center gap-1.5 hover:text-white">
                <Phone className="size-3.5 text-amber-400" />
                {storeInfo.phone}
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-4">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <Image
            src="/logo.png"
            alt=""
            width={500}
            height={500}
            className="size-11 sm:size-12"
            priority
          />
          <span className="leading-tight">
            <span className="block text-lg font-extrabold tracking-tight sm:text-xl">
              {storeInfo?.name ? (
                storeInfo.name
              ) : (
                <>
                  WEI&apos;S <span className="text-amber-400">VAPE</span>
                </>
              )}
            </span>
            <span className="block text-[10px] font-medium tracking-[0.2em] text-white/50">
              SPECIALTY VAPE STORE
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-white/80 md:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-amber-400">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 text-xs font-semibold">
          <ShieldCheck className="size-4 text-amber-400" />
          <span className="hidden sm:inline">19+ ONLY</span>
        </div>
      </div>

      <nav className="flex items-center gap-4 overflow-x-auto border-t border-white/10 px-4 py-2 text-xs font-medium text-white/70 md:hidden">
        {categories.map((category) => (
          <Link key={category.id} href={`/products?category=${category.slug}`} className="shrink-0">
            {category.name}
          </Link>
        ))}
      </nav>
    </header>
  );
}
