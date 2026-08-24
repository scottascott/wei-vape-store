import { redirect } from "next/navigation";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { auth } from "@/lib/auth";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-full flex-1">
      <AdminSidebar email={session.user.email} />
      <main className="flex-1 overflow-x-auto p-6">{children}</main>
    </div>
  );
}
