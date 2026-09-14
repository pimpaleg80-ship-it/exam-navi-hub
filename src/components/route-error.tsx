import { Link, useRouter } from "@tanstack/react-router";
import { TriangleAlert } from "lucide-react";

/**
 * Route-level error boundary. A render or data bug must never leave the user
 * staring at a blank screen — show a friendly panel with a retry instead.
 */
export function RouteError({ error }: { error: unknown }) {
  const router = useRouter();
  const message =
    error instanceof Error && error.message
      ? error.message
      : "Something unexpected happened while loading this page.";

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl border bg-card p-8 text-center">
        <TriangleAlert className="mx-auto size-10 text-destructive" aria-hidden />
        <h1 className="mt-4 text-xl font-bold">We hit a snag</h1>
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Your saved alerts and checklists on this device are safe.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => router.invalidate()}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            Try again
          </button>
          <Link
            to="/"
            className="rounded-lg border border-input px-4 py-2 text-sm font-medium hover:bg-secondary"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
