"use client";

import { useId, useState } from "react";

import { ImageUploader } from "@/components/admin/image-uploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { Banner } from "@/generated/prisma/client";

export function BannerForm({
  banner,
  action,
}: {
  banner?: Banner;
  action: (formData: FormData) => void;
}) {
  const scopeId = useId().replace(/[^a-zA-Z0-9]/g, "");
  const [image, setImage] = useState<{ url: string; key: string }>({
    url: banner?.imageUrl ?? "",
    key: banner?.imageKey ?? "",
  });

  return (
    <form action={action} className="flex max-w-md flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label>Image</Label>
        <ImageUploader
          scope="banner"
          scopeId={banner?.id ?? scopeId}
          currentUrl={image.url || null}
          onUploaded={(result) => setImage(result)}
        />
        <input type="hidden" name="imageUrl" value={image.url} required />
        <input type="hidden" name="imageKey" value={image.key} required />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" defaultValue={banner?.title} required />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="subtitle">Subtitle</Label>
        <Input id="subtitle" name="subtitle" defaultValue={banner?.subtitle ?? ""} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="linkUrl">Link URL</Label>
        <Input id="linkUrl" name="linkUrl" defaultValue={banner?.linkUrl ?? ""} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="sortOrder">Sort order</Label>
        <Input id="sortOrder" name="sortOrder" type="number" defaultValue={banner?.sortOrder ?? 0} />
      </div>
      <div className="flex items-center gap-2">
        <Switch
          id="isActive"
          name="isActive"
          value="true"
          uncheckedValue="false"
          defaultChecked={banner?.isActive ?? true}
        />
        <Label htmlFor="isActive">Active</Label>
      </div>
      <Button type="submit" className="self-start" disabled={!image.url}>
        {banner ? "Save changes" : "Create banner"}
      </Button>
    </form>
  );
}
