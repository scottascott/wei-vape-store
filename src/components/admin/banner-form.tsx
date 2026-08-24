"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RequiredMark } from "@/components/admin/required-mark";
import { Switch } from "@/components/ui/switch";
import type { Banner } from "@/generated/prisma/client";

export function BannerForm({
  banner,
  action,
}: {
  banner?: Banner;
  action: (formData: FormData) => void;
}) {
  const [imageUrl, setImageUrl] = useState(banner?.imageUrl ?? "");

  return (
    <form action={action} className="flex max-w-md flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="imageUrl">
          Image URL
          <RequiredMark />
        </Label>
        <Input
          id="imageUrl"
          name="imageUrl"
          type="url"
          placeholder="https://..."
          value={imageUrl}
          onChange={(event) => setImageUrl(event.target.value)}
          required
        />
        {imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element -- arbitrary external URL, not a local/optimizable asset
          <img
            src={imageUrl}
            alt="Preview"
            className="mt-1 h-24 w-full rounded-md border object-cover"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="title">
          Title
          <RequiredMark />
        </Label>
        <Input id="title" name="title" defaultValue={banner?.title} required />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="subtitle">
          Subtitle <span className="font-normal text-muted-foreground">(optional)</span>
        </Label>
        <Input id="subtitle" name="subtitle" defaultValue={banner?.subtitle ?? ""} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="linkUrl">
          Link URL <span className="font-normal text-muted-foreground">(optional)</span>
        </Label>
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
      <Button type="submit" className="self-start">
        {banner ? "Save changes" : "Create banner"}
      </Button>
    </form>
  );
}
