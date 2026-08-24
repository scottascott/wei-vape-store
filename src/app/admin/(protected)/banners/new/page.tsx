import { BannerForm } from "@/components/admin/banner-form";
import { createBanner } from "@/server/actions/banner.actions";

export default function NewBannerPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold">New Banner</h1>
      <div className="mt-6">
        <BannerForm action={createBanner} />
      </div>
    </div>
  );
}
