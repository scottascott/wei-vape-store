import Link from "next/link";

import { ConfirmSubmitButton } from "@/components/admin/confirm-submit-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteProduct, setProductActive } from "@/server/actions/product.actions";
import { productService } from "@/server/services/product.service";

export default async function AdminProductsPage() {
  const products = await productService.listAllForAdmin();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Products</h1>
        <Button render={<Link href="/admin/products/new">New product</Link>} />
      </div>

      <Table className="mt-6">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Brand</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell className="text-muted-foreground">{product.category.name}</TableCell>
              <TableCell className="text-muted-foreground">{product.brand?.name ?? "—"}</TableCell>
              <TableCell>
                <Badge variant={product.isActive ? "default" : "outline"}>
                  {product.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell className="flex justify-end gap-2">
                <form action={setProductActive.bind(null, product.id, !product.isActive)}>
                  <Button type="submit" variant="outline" size="sm">
                    {product.isActive ? "Deactivate" : "Activate"}
                  </Button>
                </form>
                <Button
                  render={<Link href={`/admin/products/${product.id}`}>Edit</Link>}
                  variant="outline"
                  size="sm"
                />
                <form action={deleteProduct.bind(null, product.id)}>
                  <ConfirmSubmitButton confirmMessage={`Delete product "${product.name}"?`}>
                    Delete
                  </ConfirmSubmitButton>
                </form>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
