import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex min-h-full flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm rounded-lg border p-8 text-center">
        <h1 className="text-lg font-semibold">Vape Store Admin</h1>
        <p className="mt-1 text-sm text-muted-foreground">Sign in to manage the store.</p>

        {error && (
          <p className="mt-4 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error === "AccessDenied"
              ? "That Google account isn't authorized for admin access."
              : "Something went wrong signing in. Please try again."}
          </p>
        )}

        <form
          className="mt-6"
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/admin/dashboard" });
          }}
        >
          <Button type="submit" className="w-full">
            Sign in with Google
          </Button>
        </form>
      </div>
    </div>
  );
}
