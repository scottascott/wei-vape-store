import { cn } from "@/lib/utils";

export function SectionHeading({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2 className={cn("relative inline-block pb-2 text-xl font-bold tracking-tight", className)}>
      {children}
      <span className="absolute inset-x-0 bottom-0 h-0.5 w-10 bg-amber-500" />
    </h2>
  );
}
