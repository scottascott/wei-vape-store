import { AgeGate } from "@/components/public/age-gate";
import { SiteFooter } from "@/components/public/site-footer";
import { SiteHeader } from "@/components/public/site-header";

// Content here comes straight from the admin CMS (Prisma). Forcing dynamic
// rendering means edits show up immediately with no cache/revalidation to
// reason about, and it also keeps `next build` from needing a live database
// connection to prerender these pages (relevant for the Docker build stage,
// which builds before DATABASE_URL points at a real database).
export const dynamic = "force-dynamic";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <AgeGate />
      <SiteHeader />
      {/* The header is fixed below md (see SiteHeader), so push content down
          by its height on mobile only; at md+ it's back in normal flow. */}
      <main className="max-md:pt-[76px] flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
