import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Store,
} from "lucide-react";

import { PageHero } from "@/components/public/page-hero";
import { storeInfoService } from "@/server/services/store-info.service";

const VALUES = [
  {
    icon: Store,
    title: "Local, in-store experience",
    body: "Visit our local vape shop, explore products in person, and ask our team any questions before you buy.",
  },
  {
    icon: ShieldCheck,
    title: "Strictly 19+",
    body: "Valid government-issued photo ID is required for entry and purchase—no exceptions.",
  },
  {
    icon: Sparkles,
    title: "Brands you can trust",
    body: "Explore a carefully selected range of disposables, pods, e-liquids, devices, and accessories.",
  },
];

export default async function AboutPage() {
  const storeInfo = await storeInfoService.get();
  const storeName = storeInfo?.name ?? "Wei's Vape";

  return (
    <div>
      <PageHero
        title="About Us" subtitle={`${storeInfo?.name ?? "Wei's Vape"} is your neighbourhood specialty vape store.`}
      />

      <main>
        {/* Introduction */}
        <section className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
          <div className="grid gap-7 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">
                Our Store
              </p>

              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-neutral-950">
                Local service.
                <span className="block text-amber-500">
                  Trusted selection.
                </span>
              </h2>
            </div>

            <div>
              <p className="max-w-3xl text-base leading-8 text-neutral-600 sm:text-lg">
                We carry a wide selection of quality vape products from top
                brands—including disposables, pod systems, e-liquids, devices,
                and accessories.
              </p>

              <p className="mt-4 max-w-3xl text-base leading-7 text-neutral-500">
                Browse our selection online, then visit us in store to see
                current products and flavours. Our team is available to answer
                questions and help you explore the available options.
              </p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="border-y border-neutral-200 bg-neutral-50">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:py-16">
            <div className="grid gap-5 sm:grid-cols-3">
              {VALUES.map((value) => {
                const Icon = value.icon;

                return (
                  <article
                    key={value.title}
                    className="
                      group relative overflow-hidden rounded-xl
                      border border-neutral-200 bg-white p-6
                      transition-all duration-200
                      hover:-translate-y-1 hover:border-amber-400
                      hover:shadow-lg
                    "
                  >
                    <div className="absolute inset-x-0 top-0 h-1 scale-x-0 bg-amber-400 transition-transform duration-200 group-hover:scale-x-100" />

                    <div
                      className="
                        flex size-11 items-center justify-center rounded-lg
                        bg-amber-50 text-amber-600
                        transition-colors duration-200
                        group-hover:bg-black group-hover:text-amber-400
                      "
                    >
                      <Icon className="size-5" />
                    </div>

                    <h3 className="mt-5 text-base font-bold text-neutral-950">
                      {value.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-neutral-500">
                      {value.body}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-6xl px-4 py-14 sm:py-16">
          <div className="relative overflow-hidden rounded-2xl bg-black px-6 py-8 text-white sm:px-10 sm:py-10">
            <div className="pointer-events-none absolute -right-16 -top-24 size-72 rounded-full bg-amber-400/15 blur-3xl" />

            <div className="relative flex flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
                  Visit Us
                </p>

                <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                  Explore what’s available in store.
                </h2>

                <p className="mt-2 max-w-xl text-sm leading-6 text-neutral-400">
                  Browse our products online or contact us for current
                  availability.
                </p>
              </div>

              <div className="flex shrink-0 flex-wrap gap-3">
                <Link
                  href="/products"
                  className="
                    group inline-flex items-center gap-2 rounded-full
                    bg-amber-400 px-5 py-2.5 text-sm font-semibold text-black
                    transition-colors hover:bg-amber-300
                  "
                >
                  Browse Products
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/contact"
                  className="
                    inline-flex items-center rounded-full
                    border border-white/20 px-5 py-2.5
                    text-sm font-semibold text-white
                    transition-colors hover:border-white/40 hover:bg-white/10
                  "
                >
                  Visit & Contact
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}