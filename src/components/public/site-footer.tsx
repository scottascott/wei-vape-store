import Link from "next/link";

import { storeInfoService } from "@/server/services/store-info.service";

export async function SiteFooter() {
  const storeInfo = await storeInfoService.get();

  return (
    <footer className="mt-auto border-t bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-muted-foreground">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-medium text-foreground">{storeInfo?.name ?? "Vape Store"}</p>
            {storeInfo && (
              <p>
                {storeInfo.addressLine}, {storeInfo.city}, {storeInfo.state} {storeInfo.zip}
              </p>
            )}
            {storeInfo?.phone && <p>{storeInfo.phone}</p>}
          </div>
          <nav className="flex gap-4">
            <Link href="/products" className="hover:text-foreground">
              Products
            </Link>
            <Link href="/about" className="hover:text-foreground">
              Store Info
            </Link>
          </nav>
        </div>
        <p className="mt-6 text-xs">
          21+ only. Products are available in-store only — this site does not sell online.
        </p>
      </div>
    </footer>
  );
}
