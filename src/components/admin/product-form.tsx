"use client";

import { useMemo, useState } from "react";

import { AttributeFields } from "@/components/admin/attribute-fields";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { Brand, Category, Prisma } from "@/generated/prisma/client";

type ProductWithRelations = Prisma.ProductGetPayload<{
  include: { category: true; brand: true; images: true };
}>;

// Decimal instances can't cross the Server->Client Component boundary, so the
// page passes price/salePrice pre-serialized to strings (see serializeProduct
// in the products/new and products/[id] pages).
type SerializedProduct = Omit<ProductWithRelations, "price" | "salePrice"> & {
  price: string | null;
  salePrice: string | null;
};

function toStringAttributeValues(attributes: unknown): Record<string, string> {
  const record = (attributes ?? {}) as Record<string, unknown>;
  return Object.fromEntries(
    Object.entries(record).map(([key, value]) => [key, value == null ? "" : String(value)]),
  );
}

export function ProductForm({
  categories,
  brands,
  product,
  action,
}: {
  categories: Category[];
  brands: Brand[];
  product?: SerializedProduct;
  action: (formData: FormData) => void;
}) {
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? categories[0]?.id ?? "");
  const [attributeValues, setAttributeValues] = useState<Record<string, string>>(() =>
    toStringAttributeValues(product?.attributes),
  );

  // Base UI's <Select> only shows the selected item's label (instead of its raw
  // value) in the trigger when given this map — it doesn't infer it from the
  // rendered <SelectItem> children the way Radix does.
  const categoryItems = useMemo(
    () => Object.fromEntries(categories.map((category) => [category.id, category.name])),
    [categories],
  );
  const brandItems = useMemo(
    () => ({
      none: "No brand",
      ...Object.fromEntries(brands.map((brand) => [brand.id, brand.name])),
    }),
    [brands],
  );

  const categorySlug = useMemo(
    () => categories.find((category) => category.id === categoryId)?.slug,
    [categories, categoryId],
  );

  const attributesJson = useMemo(() => {
    const cleaned = Object.fromEntries(
      Object.entries(attributeValues).filter(([, value]) => value.trim() !== ""),
    );
    return JSON.stringify(cleaned);
  }, [attributeValues]);

  return (
    <form action={action} className="flex max-w-xl flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" defaultValue={product?.name} required />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="slug">Slug</Label>
        <Input id="slug" name="slug" defaultValue={product?.slug} required />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" defaultValue={product?.description ?? ""} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="categoryId">Category</Label>
          <Select
            name="categoryId"
            items={categoryItems}
            value={categoryId}
            onValueChange={(value) => setCategoryId(value ?? "")}
            required
          >
            <SelectTrigger id="categoryId" className="w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="brandId">Brand</Label>
          <Select name="brandId" items={brandItems} defaultValue={product?.brandId ?? "none"}>
            <SelectTrigger id="brandId" className="w-full">
              <SelectValue placeholder="No brand" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No brand</SelectItem>
              {brands.map((brand) => (
                <SelectItem key={brand.id} value={brand.id}>
                  {brand.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            defaultValue={product?.price ?? ""}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="salePrice">Sale price</Label>
          <Input
            id="salePrice"
            name="salePrice"
            type="number"
            step="0.01"
            defaultValue={product?.salePrice ?? ""}
          />
        </div>
      </div>

      <div>
        <p className="text-sm font-medium">Attributes</p>
        <div className="mt-2">
          <AttributeFields
            categorySlug={categorySlug}
            values={attributeValues}
            onChange={setAttributeValues}
          />
        </div>
        <input type="hidden" name="attributes" value={attributesJson} readOnly />
      </div>

      <div className="flex flex-wrap gap-6">
        <div className="flex items-center gap-2">
          <Switch
            id="isNew"
            name="isNew"
            value="true"
            uncheckedValue="false"
            defaultChecked={product?.isNew ?? false}
          />
          <Label htmlFor="isNew">New</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            id="isOnSale"
            name="isOnSale"
            value="true"
            uncheckedValue="false"
            defaultChecked={product?.isOnSale ?? false}
          />
          <Label htmlFor="isOnSale">On sale</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            id="isActive"
            name="isActive"
            value="true"
            uncheckedValue="false"
            defaultChecked={product?.isActive ?? true}
          />
          <Label htmlFor="isActive">Active</Label>
        </div>
      </div>

      <Button type="submit" className="self-start">
        {product ? "Save changes" : "Create product"}
      </Button>
    </form>
  );
}
