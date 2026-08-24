import { notFound } from "next/navigation";

import { BannerForm } from "@/components/admin/banner-form";
import { updateBanner } from "@/server/actions/banner.actions";
import { bannerService } from "@/server/services/banner.service";

export default async function EditBannerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const banner = await bannerService.getById(id);
  if (!banner) notFound();

  return (
    <div>
      <h1 className="text-xl font-semibold">Edit Banner</h1>
      <div className="mt-6">
        <BannerForm banner={banner} action={updateBanner.bind(null, id)} />
      </div>
    </div>
  );
}
