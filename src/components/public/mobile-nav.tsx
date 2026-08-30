"use client";

import { Menu, ShieldCheck, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { NAV_LINKS } from "@/lib/nav-links";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className="flex size-10 items-center justify-center rounded-full border border-white/15"
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>

      {open && (
        <div className="fixed inset-x-0 top-[76px] z-40 flex h-[calc(100vh-76px)] flex-col bg-black px-4 py-6">
          <nav className="flex flex-col gap-1 text-base font-medium">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-3 text-white/90 hover:bg-white/5 hover:text-amber-400"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto flex items-center gap-2 border-t border-white/10 pt-4 text-xs font-semibold text-white/80">
            <ShieldCheck className="size-4 text-amber-400" />
            19+ ONLY
          </div>
        </div>
      )}
    </div>
  );
}
