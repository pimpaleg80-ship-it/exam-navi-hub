import { ExternalLink, MapPin } from "lucide-react";
import type { GovernmentExam } from "@/data/government-exams";
import { GOVERNMENT_CATEGORIES } from "@/data/government-exams";
import { cn } from "@/lib/utils";

export function GovernmentExamCard({ exam, daysLeft }: { exam: GovernmentExam; daysLeft: number }) {
  const closingSoon = daysLeft <= 30;
  return (
    <article
      className={cn(
        "positive-sheen flex flex-col gap-4 rounded-2xl border bg-card p-5 shadow-soft transition hover:-translate-y-1 hover:shadow-lifted",
        closingSoon && "border-warning/50",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
            {GOVERNMENT_CATEGORIES[exam.category].label}
          </span>
          <h3 className="mt-3 text-lg font-bold tracking-tight">{exam.code}</h3>
          <p className="break-words text-sm text-muted-foreground">{exam.name}</p>
        </div>
        {closingSoon ? (
          <span className="shrink-0 rounded-full bg-warning/20 px-2 py-1 text-xs font-semibold text-warning-foreground">
            Closing soon
          </span>
        ) : null}
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-xs text-muted-foreground">Apply by</p>
          <p className={cn("font-semibold", closingSoon && "text-destructive")}>
            {new Date(exam.applicationDeadline).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Exam date</p>
          <p className="font-semibold">
            {new Date(exam.examDate).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <MapPin className="size-3.5" />
          {exam.state}
        </span>
        <span>{exam.mode}</span>
        <span>{exam.eligibility}</span>
      </div>
      <div className="mt-auto flex items-center justify-between gap-3 border-t pt-3">
        <p className="truncate text-xs text-muted-foreground">{exam.conductingBody}</p>
        <a
          href={exam.officialUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          Official site <ExternalLink className="size-3.5" />
        </a>
      </div>
    </article>
  );
}
