import { Link } from "@tanstack/react-router";
import { Bell, BellRing, ExternalLink } from "lucide-react";
import type { Exam } from "@/data/exams";
import { CATEGORY_META } from "@/data/exams";
import { IST, formatCountdown, getExamStatus, type StatusKey } from "@/lib/exam-status";
import { cn } from "@/lib/utils";

const STATUS_CLASS: Record<StatusKey, string> = {
  upcoming: "bg-secondary text-secondary-foreground",
  registration_open: "bg-success/15 text-success",
  last_48h: "bg-destructive/15 text-destructive",
  closed: "bg-muted text-muted-foreground",
  admit_card_live: "bg-warning/20 text-warning-foreground",
  result_out: "bg-primary/12 text-primary",
};

export function ExamCard({
  exam,
  now,
  followed,
  onToggleFollow,
}: {
  exam: Exam;
  now: number;
  followed: boolean;
  onToggleFollow: (slug: string) => void;
}) {
  const status = getExamStatus(exam, now);
  const countdown = status.focus ? formatCountdown(status.focus.start_datetime, now) : undefined;
  const urgent = status.key === "last_48h";

  return (
    <article
      className={cn(
        "flex flex-col gap-4 rounded-2xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md",
        urgent && "border-destructive/40",
      )}
    >
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", STATUS_CLASS[status.key])}>
              {status.label}
            </span>
            {exam.state ? (
              <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
                {exam.state}
              </span>
            ) : null}
          </div>
          <h3 className="mt-2 truncate text-lg font-semibold tracking-tight text-card-foreground">
            {exam.short_code}
          </h3>
          <p className="truncate text-sm text-muted-foreground">{exam.full_name}</p>
        </div>
        <button
          type="button"
          onClick={() => onToggleFollow(exam.slug)}
          aria-label={followed ? `Turn off alerts for ${exam.short_code}` : `Get alerts for ${exam.short_code}`}
          className={cn(
            "shrink-0 rounded-full border p-2 transition-colors",
            followed
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border text-muted-foreground hover:bg-secondary",
          )}
        >
          {followed ? <BellRing className="size-4" /> : <Bell className="size-4" />}
        </button>
      </header>

      {status.focus && countdown ? (
        <div className="rounded-xl bg-secondary/60 p-3">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {status.focusLabel} · {status.focus.label}
            {status.focus.is_tentative ? " (tentative)" : ""}
          </p>
          <div className="mt-1 flex items-baseline gap-3">
            {(["days", "hours", "minutes"] as const).map((unit) => (
              <span key={unit} className="flex items-baseline gap-1">
                <span
                  suppressHydrationWarning
                  className={cn("text-2xl font-bold tabular-nums", urgent ? "text-destructive" : "text-foreground")}
                >
                  {countdown[unit]}
                </span>
                <span className="text-xs text-muted-foreground">{unit.slice(0, 1)}</span>
              </span>
            ))}
            <span className="ml-auto text-xs text-muted-foreground">
              {IST.format(new Date(status.focus.start_datetime))}
            </span>
          </div>
        </div>
      ) : (
        <p className="rounded-xl bg-secondary/60 p-3 text-sm text-muted-foreground">
          No dates announced for the next cycle yet.
        </p>
      )}

      <dl className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-xs text-muted-foreground">Category</dt>
          <dd className="font-medium">{CATEGORY_META[exam.category].label}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Streams</dt>
          <dd className="font-medium">{exam.streams.join(" · ")}</dd>
        </div>
      </dl>

      <footer className="mt-auto flex flex-wrap gap-2">
        <a
          href={exam.application_url}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Apply now <ExternalLink className="size-3.5" />
        </a>
        <Link
          to="/exam/$slug"
          params={{ slug: exam.slug }}
          className="inline-flex items-center justify-center rounded-lg border border-input px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary"
        >
          Details
        </Link>
      </footer>
    </article>
  );
}
