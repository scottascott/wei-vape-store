"use client";

import Image from "next/image";
import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { ProductImage } from "@/generated/prisma/client";
import { confirmProductImage, deleteProductImage, generateUploadUrl } from "@/server/actions/upload.actions";

export function ProductImageGallery({
  productId,
  images,
}: {
  productId: string;
  images: ProductImage[];
}) {
  const [isPending, startTransition] = useTransition();

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    startTransition(async () => {
      try {
        const { uploadUrl, key, publicUrl } = await generateUploadUrl({
          fileName: file.name,
          contentType: file.type,
          scope: "product",
          scopeId: productId,
        });

        const response = await fetch(uploadUrl, {
          method: "PUT",
          body: file,
          headers: { "Content-Type": file.type },
        });
        if (!response.ok) throw new Error("Upload to storage failed");

        await confirmProductImage({
          productId,
          url: publicUrl,
          key,
          sortOrder: images.length,
        });
        toast.success("Image uploaded");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Upload failed");
      } finally {
        event.target.value = "";
      }
    });
  }

  function handleDelete(imageId: string) {
    if (!window.confirm("Remove this image?")) return;
    startTransition(async () => {
      await deleteProductImage(imageId);
    });
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {images.map((image) => (
          <div key={image.id} className="relative size-24 overflow-hidden rounded-md border">
            <Image src={image.url} alt={image.alt ?? ""} fill className="object-cover" />
            <Button
              type="button"
              variant="destructive"
              size="icon-xs"
              className="absolute right-1 top-1"
              onClick={() => handleDelete(image.id)}
              disabled={isPending}
            >
              ×
            </Button>
          </div>
        ))}
      </div>
      <div className="mt-3">
        <input type="file" accept="image/*" disabled={isPending} onChange={handleFileChange} />
        {isPending && <p className="mt-1 text-xs text-muted-foreground">Working…</p>}
      </div>
    </div>
  );
}
