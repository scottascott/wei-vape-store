import { notFound } from "next/navigation";

import { ProductForm } from "@/components/admin/product-form";
import { updateProduct } from "@/server/actions/product.actions";
import { brandService } from "@/server/services/brand.service";
import { categoryService } from "@/server/services/category.service";
import { productService } from "@/server/services/product.service";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories, brands] = await Promise.all([
    productService.getById(id),
    categoryService.listAll(),
    brandService.listAll(),
  ]);

  if (!product) notFound();

  return (
    <div>
      <h1 className="text-xl font-semibold">Edit Product</h1>

      <div className="mt-6">
        <ProductForm
          categories={categories}
          brands={brands}
          product={{
            ...product,
            price: product.price?.toString() ?? null,
            salePrice: product.salePrice?.toString() ?? null,
          }}
          action={updateProduct.bind(null, id)}
        />
      </div>
    </div>
  );
}
