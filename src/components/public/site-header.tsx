import { MapPin, Phone, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { MobileNav } from "@/components/public/mobile-nav";
import { NAV_LINKS } from "@/lib/nav-links";
import { storeInfoService } from "@/server/services/store-info.service";

export async function SiteHeader() {
  const storeInfo = await storeInfoService.get();

  return (
    <header className="bg-black text-white max-md:fixed max-md:inset-x-0 max-md:top-0 max-md:z-50">
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
        <Link href="/" className="flex shrink-0 items-center">
          <Image
            src="/logo.png"
            alt={storeInfo?.name ?? "Wei's Vape"}
            width={500}
            height={500}
            className="size-11 sm:size-12"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-white/80 md:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-amber-400">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 text-xs font-semibold md:flex">
          <ShieldCheck className="size-4 text-amber-400" />
          <span>19+ ONLY</span>
        </div>

        <MobileNav />
      </div>
    </header>
  );
}
