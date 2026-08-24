export function StoreMap({ mapEmbedUrl }: { mapEmbedUrl?: string | null }) {
  if (!mapEmbedUrl) return null;

  return (
    <div className="aspect-video w-full overflow-hidden rounded-lg border">
      <iframe
        src={mapEmbedUrl}
        title="Store location map"
        className="h-full w-full"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
