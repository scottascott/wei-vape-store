import Link from "next/link";
import { ShieldCheck, Sparkles, Store } from "lucide-react";

import { PageHero } from "@/components/public/page-hero";
import { storeInfoService } from "@/server/services/store-info.service";

const VALUES = [
  {
    icon: Store,
    title: "Specialty, in-store store",
    body: "We're a local specialty vape shop — come in, ask questions, and see products in person before you buy.",
  },
  {
    icon: ShieldCheck,
    title: "19+ only, every time",
    body: "Valid government-issued photo ID is required for entry and purchase, no exceptions.",
  },
  {
    icon: Sparkles,
    title: "Trusted brands only",
    body: "We stock disposables, pods, e-liquids, devices and accessories from brands we actually trust.",
  },
];

export default async function AboutPage() {
  const storeInfo = await storeInfoService.get();

  return (
    <div>
      <PageHero
        title="About Us"
        subtitle={`${storeInfo?.name ?? "Wei's Vape"} is your neighbourhood specialty vape store.`}
      />

      <div className="mx-auto max-w-4xl px-4 py-12">
        <p className="max-w-2xl text-muted-foreground">
          We carry a wide selection of quality vape products from top brands — disposables, pod
          systems, e-liquids, devices, and accessories. Everything is available to browse here
          online, but every purchase happens in store, where our team can help you find the right
          product and answer any questions.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {VALUES.map((value) => (
            <div key={value.title} className="rounded-lg border p-5">
              <value.icon className="size-6 text-amber-500" />
              <p className="mt-3 text-sm font-semibold">{value.title}</p>
              <p className="mt-1.5 text-sm text-muted-foreground">{value.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/products"
            className="rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white hover:bg-black/90"
          >
            Browse Products
          </Link>
          <Link
            href="/contact"
            className="rounded-full border px-5 py-2.5 text-sm font-semibold hover:bg-muted"
          >
            Visit & Contact
          </Link>
        </div>
      </div>
    </div>
  );
}
