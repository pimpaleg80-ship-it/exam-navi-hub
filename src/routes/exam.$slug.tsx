import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Bell, BellRing, ExternalLink } from "lucide-react";
import { BASE_CYCLE_YEAR, CATEGORY_META, getExam, shiftExamToCycle } from "@/data/exams";
import { ISTTime, formatCountdown, getExamStatus, nextMilestone } from "@/lib/exam-status";
import { useAttemptYear, useLocalList } from "@/hooks/use-tracker";
import { RouteError } from "@/components/route-error";
import { SITE_URL, examDetailJsonLd } from "@/lib/exam-jsonld";
import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/components/scroll-reveal";
import { AdSlot } from "@/components/ad-slot";
import { AD_SLOTS } from "@/lib/adsense";

const CHECKLIST = [
  { key: "applied", label: "Application submitted" },
  { key: "fee", label: "Fee paid" },
  { key: "photo", label: "Photo & signature uploaded" },
  { key: "admit", label: "Admit card downloaded" },
];

export const Route = createFileRoute("/exam/$slug")({
  staticData: { sitemap: true },
  loader: ({ params }) => {
    const exam = getExam(params.slug);
    if (!exam) throw notFound();
    return { exam };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Exam not found — EduAlert PCMB" }, { name: "robots", content: "noindex" }] };
    }
    const { exam } = loaderData;
    const title = `${exam.short_code} dates, fees & eligibility — EduAlert PCMB`;
    const description = `${exam.full_name} by ${exam.conducting_body}: registration window, admit card, exam day and result dates with live countdowns.`;
    const url = `${SITE_URL}/exam/${exam.slug}`;
    const { page, breadcrumbs, events } = examDetailJsonLd(exam);
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(page) },
        { type: "application/ld+json", children: JSON.stringify(breadcrumbs) },
        ...events.map((event) => ({
          type: "application/ld+json",
          children: JSON.stringify(event),
        })),
      ],
    };
  },
  errorComponent: RouteError,
  component: ExamDetail,
});

function ExamDetail() {
  const { exam: baseExam } = Route.useLoaderData();
  const [year] = useAttemptYear(BASE_CYCLE_YEAR);
  const exam = shiftExamToCycle(baseExam, year);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);

  const follow = useLocalList("followed");
  const checklist = useLocalList(`checklist:${exam.slug}`);
  const status = getExamStatus(exam, now);
  const upcoming = nextMilestone(exam, now);
  const countdown = upcoming ? formatCountdown(upcoming.start_datetime, now) : undefined;

  return (
    <main className="min-h-screen bg-background">
      <div className="border-b bg-card/85 shadow-soft backdrop-blur-sm">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-[color,transform] hover:-translate-x-0.5 hover:text-foreground"
          >
            <ArrowLeft className="size-4" /> All exams
          </Link>
          <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                {CATEGORY_META[exam.category]?.label ?? "Entrance exam"}
                {exam.state ? ` · ${exam.state}` : ""}
              </p>
              <h1 className="mt-1 animate-fade-in text-3xl font-extrabold tracking-tight">{exam.short_code}</h1>
              <p className="text-muted-foreground">{exam.full_name}</p>
              <p className="mt-1 text-sm text-muted-foreground">{exam.conducting_body}</p>
            </div>
            <button
              type="button"
              onClick={() => follow.toggle(exam.slug)}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold shadow-sm transition-[transform,color,background-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0",
                follow.has(exam.slug)
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-input hover:bg-secondary",
              )}
            >
              {follow.has(exam.slug) ? <BellRing className="size-4" /> : <Bell className="size-4" />}
              {follow.has(exam.slug) ? "Alerts on" : "Get alerts"}
            </button>
          </div>

          <div className="positive-sheen mt-6 flex flex-wrap items-center gap-4 rounded-xl border border-primary/10 bg-secondary/60 p-4 shadow-soft">
            <span className="rounded-full bg-card px-3 py-1 text-xs font-semibold">{status.label}</span>
            {upcoming && countdown ? (
              <p className="text-sm">
                <span className="font-semibold tabular-nums">
                  {countdown.days}d {countdown.hours}h {countdown.minutes}m
                </span>{" "}
                <span className="text-muted-foreground">until {upcoming.label}</span>
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">Next cycle dates awaited.</p>
            )}
            <a
              href={exam.application_url}
              target="_blank"
              rel="noreferrer noopener"
              className="relative z-[1] ml-auto inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-[transform,box-shadow,opacity] hover:-translate-y-0.5 hover:shadow-md hover:opacity-95 active:translate-y-0"
            >
              Apply now <ExternalLink className="size-3.5" />
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-4xl gap-8 px-4 py-8 lg:grid-cols-[2fr_1fr]">
        <ScrollReveal className="min-w-0">
          <h2 className="text-lg font-semibold">Full timeline</h2>
          <ol className="mt-4 space-y-3">
            {[...(exam.dates ?? [])]
              .sort(
                (a, b) =>
                  new Date(a.start_datetime).getTime() - new Date(b.start_datetime).getTime(),
              )
              .map((date, i) => {
                const past = new Date(date.start_datetime).getTime() <= now;
                return (
                  <li
                    key={`${date.event_type}-${i}`}
                    className={cn(
                       "flex flex-wrap items-center justify-between gap-2 rounded-xl border p-3 shadow-sm transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md",
                      past ? "opacity-60" : "bg-card",
                    )}
                  >
                    <div>
                      <p className="text-sm font-medium">{date.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {ISTTime.format(new Date(date.start_datetime))} IST
                        {date.end_datetime
                          ? ` → ${ISTTime.format(new Date(date.end_datetime))} IST`
                          : ""}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-xs font-medium",
                        date.is_tentative
                          ? "bg-warning/20 text-warning-foreground"
                          : "bg-success/15 text-success",
                      )}
                    >
                      {date.is_tentative ? "Tentative" : "Confirmed"}
                    </span>
                  </li>
                );
              })}
          </ol>

          <h2 className="mt-8 text-lg font-semibold">Eligibility & pattern</h2>
          <dl className="mt-3 space-y-3 rounded-xl border bg-card p-4 text-sm">
            <Row label="Who can apply" value={exam.eligibility_summary} />
            <Row label="Minimum marks" value={exam.min_percentage} />
            <Row label="Age limit" value={exam.age_limit} />
            <Row label="Exam pattern" value={exam.pattern} />
            <Row label="Streams" value={(exam.streams ?? []).join(" · ")} />
          </dl>
        </ScrollReveal>

        <ScrollReveal className="space-y-6">
          <div className="rounded-xl border bg-card p-4 shadow-soft transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lifted">
            <h2 className="text-sm font-semibold">Application fee</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {(exam.fees ?? []).map((fee) => (
                <li key={fee.category_label} className="flex justify-between gap-3">
                  <span className="text-muted-foreground">{fee.category_label}</span>
                  <span className="font-semibold tabular-nums">
                    {fee.amount === 0 ? "Free" : `₹${fee.amount.toLocaleString("en-IN")}`}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border bg-card p-4 shadow-soft transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lifted">
            <h2 className="text-sm font-semibold">My application checklist</h2>
            <p className="mt-1 text-xs text-muted-foreground">Saved on this device only.</p>
            <ul className="mt-3 space-y-2">
              {CHECKLIST.map((item) => (
                <li key={item.key}>
                  <label className="flex cursor-pointer items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={checklist.has(item.key)}
                      onChange={() => checklist.toggle(item.key)}
                      className="size-4 accent-[var(--primary)]"
                    />
                    <span className={cn(checklist.has(item.key) && "text-muted-foreground line-through")}>
                      {item.label}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </div>

          <a
            href={exam.official_website}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-input bg-card px-3 py-2 text-sm font-medium shadow-sm transition-[transform,background-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-secondary hover:shadow-md active:translate-y-0"
          >
            Official website <ExternalLink className="size-3.5" />
          </a>
          <AdSlot slot={AD_SLOTS.examDetail} />
        </ScrollReveal>
      </div>
    </main>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-0.5">{value}</dd>
    </div>
  );
}
