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

  // price/salePrice are Decimal instances and can't cross the Server->Client
  // Component boundary; the form doesn't edit them, so drop them here.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { price, salePrice, ...productForForm } = product;

  return (
    <div>
      <h1 className="text-xl font-semibold">Edit Product</h1>

      <div className="mt-6">
        <ProductForm
          categories={categories}
          brands={brands}
          product={productForForm}
          action={updateProduct.bind(null, id)}
        />
      </div>
    </div>
  );
}
