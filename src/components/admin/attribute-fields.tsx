"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  attributeFieldDefinitions,
  internalFieldDefinitions,
  type KnownAttributeCategorySlug,
} from "@/lib/attribute-schemas";

function FieldGrid({
  fields,
  values,
  onChange,
}: {
  fields: Array<{ name: string; label: string; type: "text" | "number" }>;
  values: Record<string, string>;
  onChange: (next: Record<string, string>) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {fields.map((field) => (
        <div key={field.name} className="flex flex-col gap-1.5">
          <Label htmlFor={`attr-${field.name}`}>{field.label}</Label>
          <Input
            id={`attr-${field.name}`}
            type={field.type === "number" ? "number" : "text"}
            value={values[field.name] ?? ""}
            onChange={(event) => onChange({ ...values, [field.name]: event.target.value })}
          />
        </div>
      ))}
    </div>
  );
}

export function AttributeFields({
  categorySlug,
  values,
  onChange,
}: {
  categorySlug: string | undefined;
  values: Record<string, string>;
  onChange: (next: Record<string, string>) => void;
}) {
  const definitions =
    categorySlug && categorySlug in attributeFieldDefinitions
      ? attributeFieldDefinitions[categorySlug as KnownAttributeCategorySlug]
      : [];

  if (definitions.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="mb-2 text-xs text-muted-foreground">
          All fields below are optional — leave anything blank you don&apos;t know yet.
        </p>
        <FieldGrid fields={definitions} values={values} onChange={onChange} />
      </div>
      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground">
          Internal (not shown on the public site)
        </p>
        <FieldGrid fields={internalFieldDefinitions} values={values} onChange={onChange} />
      </div>
    </div>
  );
}
