const DAY_LABELS: Record<string, string> = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
  sun: "Sunday",
};

const DAY_ORDER = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

export function StoreHours({ hours }: { hours: unknown }) {
  const record = (hours ?? {}) as Record<string, string | undefined>;

  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
      {DAY_ORDER.map((day) => (
        <div key={day} className="contents">
          <dt className="text-muted-foreground">{DAY_LABELS[day]}</dt>
          <dd>{record[day] || "Closed"}</dd>
        </div>
      ))}
    </dl>
  );
}
