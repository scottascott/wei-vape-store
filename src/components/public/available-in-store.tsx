export function AvailableInStore({ className }: { className?: string }) {
  return (
    <p className={className ?? "text-sm font-medium text-muted-foreground"}>
      Available In Store — Contact us for current availability.
    </p>
  );
}
