import "server-only";

import { auth } from "@/lib/auth";
import { DEV_ADMIN_EMAIL, isAdminAuthBypassed } from "@/lib/dev-auth-bypass";

export async function requireAdminSession() {
  const session = await auth();
  if (session?.user?.email) {
    return session;
  }
  if (isAdminAuthBypassed()) {
    return { user: { email: DEV_ADMIN_EMAIL } };
  }
  throw new Error("Unauthorized");
}
