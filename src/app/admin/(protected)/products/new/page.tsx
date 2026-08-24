import { ProductForm } from "@/components/admin/product-form";
import { createProduct } from "@/server/actions/product.actions";
import { brandService } from "@/server/services/brand.service";
import { categoryService } from "@/server/services/category.service";

export default async function NewProductPage() {
  const [categories, brands] = await Promise.all([
    categoryService.listAll(),
    brandService.listAll(),
  ]);

  return (
    <div>
      <h1 className="text-xl font-semibold">New Product</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Save the product first, then add images on the edit page.
      </p>
      <div className="mt-6">
        <ProductForm categories={categories} brands={brands} action={createProduct} />
      </div>
    </div>
  );
}
