import { Clock, MapPin, Phone } from "lucide-react";
import Link from "next/link";

import { storeInfoService } from "@/server/services/store-info.service";

const DAY_LABELS: Record<string, string> = {
  mon: "Mon",
  tue: "Tue",
  wed: "Wed",
  thu: "Thu",
  fri: "Fri",
  sat: "Sat",
  sun: "Sun",
};
const DAY_ORDER = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

function groupHours(hours: unknown) {
  const record = (hours ?? {}) as Record<string, string | undefined>;
  const groups: { label: string; value: string }[] = [];
  let runStart: string | null = null;
  let runValue: string | null = null;

  const flush = (endDay: string) => {
    if (runStart == null || runValue == null) return;
    const startLabel = DAY_LABELS[runStart] ?? runStart;
    const endLabel = DAY_LABELS[endDay] ?? endDay;
    const label = runStart === endDay ? startLabel : `${startLabel} – ${endLabel}`;
    groups.push({ label, value: runValue });
  };

  DAY_ORDER.forEach((day, index) => {
    const value = record[day]?.trim() || "Closed";
    if (value !== runValue) {
      const previousDay = DAY_ORDER[index - 1];
      if (index > 0 && previousDay) flush(previousDay);
      runStart = day;
      runValue = value;
    }
    if (index === DAY_ORDER.length - 1) flush(day);
  });

  return groups;
}

export async function SiteFooter() {
  const storeInfo = await storeInfoService.get();
  const hoursGroups = storeInfo ? groupHours(storeInfo.hours) : [];

  return (
    <footer className="mt-auto bg-black text-white">
      <div className="border-b border-white/10 bg-muted/5 text-foreground">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="flex items-center gap-2 text-xs font-semibold tracking-wide text-white/50">
              <MapPin className="size-4 text-amber-400" />
              VISIT US
            </h3>
            {storeInfo ? (
              <p className="mt-2 text-white/80">
                {storeInfo.addressLine}
                <br />
                {storeInfo.city}, {storeInfo.state} {storeInfo.zip}
              </p>
            ) : (
              <p className="mt-2 text-white/50">Store info coming soon.</p>
            )}
          </div>

          <div>
            <h3 className="flex items-center gap-2 text-xs font-semibold tracking-wide text-white/50">
              <Clock className="size-4 text-amber-400" />
              HOURS
            </h3>
            <dl className="mt-2 space-y-0.5 text-white/80">
              {hoursGroups.map((group) => (
                <div key={group.label} className="flex justify-between gap-4">
                  <dt className="text-white/50">{group.label}</dt>
                  <dd>{group.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <h3 className="flex items-center gap-2 text-xs font-semibold tracking-wide text-white/50">
              <Phone className="size-4 text-amber-400" />
              CONTACT
            </h3>
            <div className="mt-2 space-y-0.5 text-white/80">
              {storeInfo?.phone && <p>{storeInfo.phone}</p>}
              {storeInfo?.email && <p>{storeInfo.email}</p>}
              <Link href="/contact" className="inline-block text-amber-400 hover:underline">
                Get directions
              </Link>
            </div>
          </div>

          <div>
            <h3 className="flex items-center gap-2 text-xs font-semibold tracking-wide text-white/50">
              <MapPin className="size-4 text-amber-400" />
              FIND US
            </h3>
            <div className="mt-2 h-20 overflow-hidden rounded-md border border-white/10">
              {storeInfo?.mapEmbedUrl ? (
                <iframe
                  src={storeInfo.mapEmbedUrl}
                  title="Store location map"
                  className="h-full w-full grayscale"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-white/5 text-xs text-white/40">
                  Map coming soon
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-4 text-center text-xs text-white/50">
        <p className="flex flex-wrap items-center justify-center gap-x-2">
          <span>19+ ONLY</span>
          <span aria-hidden="true">|</span>
          <span>ID REQUIRED FOR ENTRY</span>
          <span aria-hidden="true">|</span>
          <span>IN-STORE ONLY</span>
        </p>
        <p className="mt-1">
          &copy; {new Date().getFullYear()} {storeInfo?.name ?? "Wei's Vape"}. All rights reserved.
        </p>
        <p className="mt-1 text-white/30">
          Site by{" "}
          <Link
            href="https://scottascott.github.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white/60"
          >
            Scott
          </Link>
        </p>
      </div>
    </footer>
  );
}
