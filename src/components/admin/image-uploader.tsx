"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { generateUploadUrl } from "@/server/actions/upload.actions";

type Scope = "product" | "banner" | "brand";

export function ImageUploader({
  scope,
  scopeId,
  currentUrl,
  onUploaded,
}: {
  scope: Scope;
  scopeId: string;
  currentUrl?: string | null;
  onUploaded: (result: { url: string; key: string }) => void;
}) {
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null);
  const [isPending, startTransition] = useTransition();

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    startTransition(async () => {
      try {
        const { uploadUrl, key, publicUrl } = await generateUploadUrl({
          fileName: file.name,
          contentType: file.type,
          scope,
          scopeId,
        });

        const response = await fetch(uploadUrl, {
          method: "PUT",
          body: file,
          headers: { "Content-Type": file.type },
        });
        if (!response.ok) throw new Error("Upload to storage failed");

        setPreview(publicUrl);
        onUploaded({ url: publicUrl, key });
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Upload failed");
      } finally {
        event.target.value = "";
      }
    });
  }

  return (
    <div className="flex items-center gap-4">
      {preview && (
        <div className="relative size-20 shrink-0 overflow-hidden rounded-md border bg-muted">
          <Image src={preview} alt="Preview" fill className="object-cover" />
        </div>
      )}
      <div>
        <input
          type="file"
          accept="image/*"
          disabled={isPending}
          onChange={handleFileChange}
          className="text-sm"
        />
        {isPending && <p className="mt-1 text-xs text-muted-foreground">Uploading…</p>}
      </div>
    </div>
  );
}
