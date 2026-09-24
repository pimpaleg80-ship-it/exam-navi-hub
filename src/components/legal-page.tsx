import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated?: string;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <Link to="/" className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          ← EXAM ALERT INDIA
        </Link>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight">{title}</h1>
        {updated && <p className="mt-1 text-xs text-muted-foreground">Last updated: {updated}</p>}
        <div className="mt-6 space-y-4 text-sm leading-relaxed text-foreground/90 [&_a]:text-primary [&_a]:underline [&_h2]:mt-6 [&_h2]:text-lg [&_h2]:font-semibold [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
          {children}
        </div>
      </div>
    </main>
  );
}
