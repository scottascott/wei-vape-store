import { PageHero } from "@/components/public/page-hero";
import { StoreHours } from "@/components/public/store-hours";
import { StoreMap } from "@/components/public/store-map";
import { storeInfoService } from "@/server/services/store-info.service";

export default async function ContactPage() {
  const storeInfo = await storeInfoService.get();

  if (!storeInfo) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <p className="text-sm text-muted-foreground">Store info hasn&apos;t been set up yet.</p>
      </div>
    );
  }

  const socialLinks = (storeInfo.socialLinks ?? {}) as Record<string, string | undefined>;

  return (
    <div>
      <PageHero title="Visit & Contact" subtitle="Come see us in store — we'd love to help you find what you need." />

      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <h2 className="text-sm font-medium text-muted-foreground">Location</h2>
            <p className="mt-2 text-sm">
              {storeInfo.addressLine}
              <br />
              {storeInfo.city}, {storeInfo.state} {storeInfo.zip}
            </p>
            <h2 className="mt-6 text-sm font-medium text-muted-foreground">Contact</h2>
            <p className="mt-2 text-sm">{storeInfo.phone}</p>
            {storeInfo.email && <p className="text-sm">{storeInfo.email}</p>}
            {(socialLinks.instagram || socialLinks.facebook || socialLinks.twitter) && (
              <div className="mt-3 flex gap-3 text-sm">
                {socialLinks.instagram && (
                  <a href={socialLinks.instagram} className="text-muted-foreground hover:text-foreground">
                    Instagram
                  </a>
                )}
                {socialLinks.facebook && (
                  <a href={socialLinks.facebook} className="text-muted-foreground hover:text-foreground">
                    Facebook
                  </a>
                )}
                {socialLinks.twitter && (
                  <a href={socialLinks.twitter} className="text-muted-foreground hover:text-foreground">
                    Twitter
                  </a>
                )}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-sm font-medium text-muted-foreground">Hours</h2>
            <div className="mt-2">
              <StoreHours hours={storeInfo.hours} />
            </div>
          </div>
        </div>

        {storeInfo.mapEmbedUrl && (
          <div className="mt-8">
            <StoreMap mapEmbedUrl={storeInfo.mapEmbedUrl} />
          </div>
        )}
      </div>
    </div>
  );
}
