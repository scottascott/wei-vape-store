import { notFound } from "next/navigation";

import { BrandForm } from "@/components/admin/brand-form";
import { updateBrand } from "@/server/actions/brand.actions";
import { brandService } from "@/server/services/brand.service";

export default async function EditBrandPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const brand = await brandService.getById(id);
  if (!brand) notFound();

  return (
    <div>
      <h1 className="text-xl font-semibold">Edit Brand</h1>
      <div className="mt-6">
        <BrandForm brand={brand} action={updateBrand.bind(null, id)} />
      </div>
    </div>
  );
}
