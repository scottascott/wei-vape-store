import Image from "next/image";
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
import { deleteBanner } from "@/server/actions/banner.actions";
import { bannerService } from "@/server/services/banner.service";

export default async function AdminBannersPage() {
  const banners = await bannerService.listAll();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Banners</h1>
        <Button render={<Link href="/admin/banners/new">New banner</Link>} nativeButton={false} />
      </div>

      <Table className="mt-6">
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Sort</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {banners.map((banner) => (
            <TableRow key={banner.id}>
              <TableCell>
                <div className="relative size-12 overflow-hidden rounded-md border bg-muted">
                  <Image src={banner.imageUrl} alt={banner.title} fill className="object-cover" />
                </div>
              </TableCell>
              <TableCell>{banner.title}</TableCell>
              <TableCell>{banner.sortOrder}</TableCell>
              <TableCell>
                <Badge variant={banner.isActive ? "default" : "outline"}>
                  {banner.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell className="flex justify-end gap-2">
                <Button
                  render={<Link href={`/admin/banners/${banner.id}`}>Edit</Link>}
                  nativeButton={false}
                  variant="outline"
                  size="sm"
                />
                <form action={deleteBanner.bind(null, banner.id)}>
                  <ConfirmSubmitButton confirmMessage={`Delete banner "${banner.title}"?`}>
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
