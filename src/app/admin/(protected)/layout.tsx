import { redirect } from "next/navigation";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { auth } from "@/lib/auth";
import { DEV_ADMIN_EMAIL, isAdminAuthBypassed } from "@/lib/dev-auth-bypass";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const bypassed = isAdminAuthBypassed();
  if (!session?.user?.email && !bypassed) {
    redirect("/admin/login");
  }

  const email = session?.user?.email ?? `${DEV_ADMIN_EMAIL} (auth disabled in dev)`;

  return (
    <div className="flex min-h-full flex-1">
      <AdminSidebar email={email} />
      <main className="flex-1 overflow-x-auto p-6">{children}</main>
    </div>
  );
}
