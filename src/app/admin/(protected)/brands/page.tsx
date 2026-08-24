import Link from "next/link";

import { ConfirmSubmitButton } from "@/components/admin/confirm-submit-button";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteBrand } from "@/server/actions/brand.actions";
import { brandService } from "@/server/services/brand.service";

export default async function AdminBrandsPage() {
  const brands = await brandService.listAll();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Brands</h1>
        <Button render={<Link href="/admin/brands/new">New brand</Link>} nativeButton={false} />
      </div>

      <Table className="mt-6">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {brands.map((brand) => (
            <TableRow key={brand.id}>
              <TableCell>{brand.name}</TableCell>
              <TableCell className="text-muted-foreground">{brand.slug}</TableCell>
              <TableCell className="flex justify-end gap-2">
                <Button
                  render={<Link href={`/admin/brands/${brand.id}`}>Edit</Link>}
                  nativeButton={false}
                  variant="outline"
                  size="sm"
                />
                <form action={deleteBrand.bind(null, brand.id)}>
                  <ConfirmSubmitButton confirmMessage={`Delete brand "${brand.name}"?`}>
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
