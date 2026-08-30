"use client";

import { Dialog } from "@base-ui/react/dialog";
import Image from "next/image";
import { useSyncExternalStore } from "react";

const SESSION_KEY = "wv-age-verified";
const listeners = new Set<() => void>();

function isVerified() {
  return sessionStorage.getItem(SESSION_KEY) === "true";
}

function verify() {
  sessionStorage.setItem(SESSION_KEY, "true");
  for (const listener of listeners) listener();
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

// Treat SSR/first hydration paint as "verified" so the gate never flashes in
// the server-rendered HTML — useSyncExternalStore reconciles against the real
// sessionStorage value immediately after hydration.
function getServerSnapshot() {
  return true;
}

export function AgeGate() {
  const verified = useSyncExternalStore(subscribe, isVerified, getServerSnapshot);

  function handleExit() {
    window.location.href = "https://www.google.com";
  }

  return (
    // Fully controlled by sessionStorage — Esc/outside click are no-ops here,
    // only the Yes/No buttons below can dismiss it.
    <Dialog.Root open={!verified} modal onOpenChange={() => {}}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 text-center shadow-xl outline-none sm:p-8">
          <div className="mx-auto flex size-20 items-center justify-center overflow-hidden rounded-full border-4 border-neutral-100 bg-black">
            <Image
              src="/logo.png"
              alt="Wei's Vape"
              width={80}
              height={80}
              className="size-full object-cover"
            />
          </div>

          <h2 className="mt-5 text-2xl font-extrabold tracking-tight text-black">
            Age Verification Required
          </h2>

          <p className="mt-3 text-sm text-neutral-500">
            This website contains information about vape products intended only for adults of
            legal vaping age (19+) in their province or region.
          </p>

          <p className="mt-5 text-sm font-semibold text-black">
            Are you 19 years of age or older?
          </p>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={verify}
              className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-neutral-800"
            >
              Yes, I am 19 or older
            </button>
            <button
              type="button"
              onClick={handleExit}
              className="rounded-full border border-neutral-200 px-6 py-3 text-sm font-semibold text-neutral-700 transition-colors hover:bg-neutral-100"
            >
              No, Exit
            </button>
          </div>

          <p className="mt-5 text-xs text-neutral-400">
            By entering, you confirm you are at least 19 years of age. Please follow all
            applicable vaping laws and regulations in your province or region.
          </p>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
