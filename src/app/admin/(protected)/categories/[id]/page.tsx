import { notFound } from "next/navigation";

import { CategoryForm } from "@/components/admin/category-form";
import { updateCategory } from "@/server/actions/category.actions";
import { categoryService } from "@/server/services/category.service";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = await categoryService.getById(id);
  if (!category) notFound();

  return (
    <div>
      <h1 className="text-xl font-semibold">Edit Category</h1>
      <div className="mt-6">
        <CategoryForm category={category} action={updateCategory.bind(null, id)} />
      </div>
    </div>
  );
}
