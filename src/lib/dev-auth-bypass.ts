/**
 * Skips the admin auth gate during local development so admin pages/actions
 * can be exercised without going through Google sign-in every time.
 *
 * Safe by construction: Next.js itself forces NODE_ENV to "development" for
 * `next dev` and to "production" for `next build`/`next start` (and thus for
 * the Docker image), regardless of what's in .env — so this can never be true
 * in a real deployment.
 */
export function isAdminAuthBypassed(): boolean {
  return process.env.NODE_ENV === "development";
}

export const DEV_ADMIN_EMAIL = "dev@localhost";
