"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  attributeFieldDefinitions,
  type KnownAttributeCategorySlug,
} from "@/lib/attribute-schemas";

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
    <div className="grid grid-cols-2 gap-3">
      {definitions.map((field) => (
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
