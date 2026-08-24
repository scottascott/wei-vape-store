import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Brand } from "@/generated/prisma/client";

export function BrandForm({
  brand,
  action,
}: {
  brand?: Brand;
  action: (formData: FormData) => void;
}) {
  return (
    <form action={action} className="flex max-w-md flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" defaultValue={brand?.name} required />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="slug">Slug</Label>
        <Input id="slug" name="slug" defaultValue={brand?.slug} required />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="logoUrl">Logo URL</Label>
        <Input id="logoUrl" name="logoUrl" defaultValue={brand?.logoUrl ?? ""} />
      </div>
      <Button type="submit" className="self-start">
        {brand ? "Save changes" : "Create brand"}
      </Button>
    </form>
  );
}
