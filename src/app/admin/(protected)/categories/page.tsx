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
import { deleteCategory } from "@/server/actions/category.actions";
import { categoryService } from "@/server/services/category.service";

export default async function AdminCategoriesPage() {
  const categories = await categoryService.listAll();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Categories</h1>
        <Button render={<Link href="/admin/categories/new">New category</Link>} nativeButton={false} />
      </div>

      <Table className="mt-6">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Sort</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell>{category.name}</TableCell>
              <TableCell className="text-muted-foreground">{category.slug}</TableCell>
              <TableCell>{category.sortOrder}</TableCell>
              <TableCell className="flex justify-end gap-2">
                <Button
                  render={<Link href={`/admin/categories/${category.id}`}>Edit</Link>}
                  nativeButton={false}
                  variant="outline"
                  size="sm"
                />
                <form action={deleteCategory.bind(null, category.id)}>
                  <ConfirmSubmitButton confirmMessage={`Delete category "${category.name}"?`}>
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
