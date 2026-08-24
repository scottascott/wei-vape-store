export function PageHero({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="bg-black text-white">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:py-16">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">{title}</h1>
        {subtitle && <p className="mt-3 max-w-xl text-white/70">{subtitle}</p>}
      </div>
    </div>
  );
}
