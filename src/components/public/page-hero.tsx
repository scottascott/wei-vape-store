export function PageHero({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="relative overflow-hidden border-t border-white/10 bg-gradient-to-r from-black via-neutral-950 to-black text-white">
      {/* Subtle decorative glow */}
      <div className="pointer-events-none absolute -right-20 -top-32 size-80 rounded-full bg-amber-400/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 py-11 sm:py-14">
        <div className="border-l-4 border-amber-400 pl-5">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
            {title}
          </h1>

          {subtitle && (
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65 sm:text-base">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
    </section>
  );
}