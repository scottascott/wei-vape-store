import { notFound } from "next/navigation";

import { ProductForm } from "@/components/admin/product-form";
import { ProductImageGallery } from "@/components/admin/product-image-gallery";
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
        <h2 className="text-sm font-medium text-muted-foreground">Images</h2>
        <div className="mt-2">
          <ProductImageGallery productId={product.id} images={product.images} />
        </div>
      </div>

      <div className="mt-8">
        <ProductForm
          categories={categories}
          brands={brands}
          product={product}
          action={updateProduct.bind(null, id)}
        />
      </div>
    </div>
  );
}
