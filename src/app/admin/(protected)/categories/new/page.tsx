import { CategoryForm } from "@/components/admin/category-form";
import { createCategory } from "@/server/actions/category.actions";

export default function NewCategoryPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold">New Category</h1>
      <div className="mt-6">
        <CategoryForm action={createCategory} />
      </div>
    </div>
  );
}
