import { BrandForm } from "@/components/admin/brand-form";
import { createBrand } from "@/server/actions/brand.actions";

export default function NewBrandPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold">New Brand</h1>
      <div className="mt-6">
        <BrandForm action={createBrand} />
      </div>
    </div>
  );
}
