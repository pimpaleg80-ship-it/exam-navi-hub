import { Link } from "@tanstack/react-router";
import { ArrowRight, Bell, BellRing, ExternalLink, ShieldCheck } from "lucide-react";
import { useRef } from "react";
import type { Exam, ExamDate } from "@/data/exams";
import { CATEGORY_META } from "@/data/exams";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
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

const fmt = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : IST.format(d);
};

function range(open?: ExamDate, close?: ExamDate) {
  if (!open && !close) return null;
  const a = fmt(open?.start_datetime);
  const b = fmt(close?.start_datetime);
  return a && b ? `${a} – ${b}` : a || b;
}

function insight(statusKey: StatusKey, days: number | undefined, examDate?: ExamDate) {
  if (statusKey === "last_48h") return "Registration closes within 48 hours";
  if (statusKey === "registration_open")
    return days !== undefined ? `Registration closes in ${days} day${days === 1 ? "" : "s"}` : "Registration is currently open";
  if (statusKey === "upcoming")
    return days !== undefined ? `Registration opens in ${days} day${days === 1 ? "" : "s"}` : "Registration opens soon";
  if (statusKey === "admit_card_live") return "Admit card is live";
  if (statusKey === "result_out") return "Result has been declared";
  if (!examDate) return "Exam date not announced yet";
  return examDate.is_tentative ? "Exam date is tentative" : "Exam date officially announced";
}

export function ExamCard({
  exam,
  now,
  followed,
  onToggleFollow,
  index = 0,
}: {
  exam: Exam;
  now: number;
  followed: boolean;
  onToggleFollow: (slug: string) => void;
  index?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const frame = useRef<number | null>(null);
  const reduce = useReducedMotion();
  const status = getExamStatus(exam, now);
  const countdown = status.focus ? formatCountdown(status.focus.start_datetime, now) : undefined;
  const urgent = status.key === "last_48h";
  const dates = exam.dates ?? [];
  const regOpen = dates.find((d) => d.event_type === "registration_open");
  const regClose = dates.find((d) => d.event_type === "registration_close");
  const examDate = dates.find((d) => d.event_type === "exam_date");
  const regRange = range(regOpen, regClose);
  const line = insight(status.key, countdown && !countdown.expired ? countdown.days : undefined, examDate);

  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const { clientX, clientY } = e;
    if (frame.current) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const r = el.getBoundingClientRect();
      const x = (clientX - r.left) / r.width;
      const y = (clientY - r.top) / r.height;
      el.style.setProperty("--mouse-x", `${x * 100}%`);
      el.style.setProperty("--mouse-y", `${y * 100}%`);
      el.style.setProperty("--tilt-x", `${(0.5 - y) * 3}deg`);
      el.style.setProperty("--tilt-y", `${(x - 0.5) * 3}deg`);
      el.style.setProperty("--shift-x", `${(x - 0.5) * 3}px`);
      el.style.setProperty("--shift-y", `${(y - 0.5) * 3}px`);
    });
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    if (frame.current) cancelAnimationFrame(frame.current);
    ["--tilt-x", "--tilt-y"].forEach((p) => el.style.setProperty(p, "0deg"));
    ["--shift-x", "--shift-y"].forEach((p) => el.style.setProperty(p, "0px"));
  };

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 15, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: (index % 3) * 0.07 }}
      whileHover={reduce ? undefined : { y: -4, scale: 1.01 }}
      className="h-full [perspective:1000px]"
    >
      <article
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className={cn("premium-card group flex h-full flex-col gap-4 p-5", urgent && "premium-card-urgent")}
      >
        <div className="premium-card-content flex h-full flex-col gap-4">
          <header className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-3">
              <div className="grid size-11 shrink-0 place-items-center rounded-xl border bg-gradient-to-br from-secondary to-card text-sm font-bold tracking-tight text-primary">
                {exam.short_code.replace(/[^A-Za-z0-9]/g, "").slice(0, 3).toUpperCase()}
              </div>
              <div className="min-w-0">
                <h3 className="truncate text-lg font-semibold tracking-tight text-card-foreground">
                  {exam.short_code}
                </h3>
                <p className="truncate text-sm text-muted-foreground">{exam.full_name}</p>
              </div>
            </div>
            <motion.span
              key={status.key}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn("shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold", STATUS_CLASS[status.key])}
            >
              {status.label}
            </motion.span>
          </header>

          <div className="flex flex-wrap gap-1.5 text-xs">
            <span className="rounded-full border px-2 py-0.5 text-muted-foreground">
              {CATEGORY_META[exam.category]?.label ?? "Entrance exam"}
            </span>
            {(exam.streams ?? []).length ? (
              <span className="rounded-full border px-2 py-0.5 text-muted-foreground">{exam.streams.join(" · ")}</span>
            ) : null}
            {exam.state ? <span className="rounded-full border px-2 py-0.5 text-muted-foreground">{exam.state}</span> : null}
          </div>

          <dl className="grid grid-cols-2 gap-3 rounded-xl border bg-secondary/40 p-3 text-sm">
            <div className="min-w-0">
              <dt className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Registration</dt>
              <dd className="mt-1 font-medium">{regRange ?? "Not announced"}</dd>
            </div>
            <div className="min-w-0">
              <dt className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Exam date</dt>
              <dd className="mt-1 font-medium">
                {examDate ? fmt(examDate.start_datetime) : "Not announced"}
                {examDate?.is_tentative ? <span className="ml-1 text-xs text-muted-foreground">(tentative)</span> : null}
              </dd>
            </div>
          </dl>

          <div>
            <p className={cn("text-sm font-semibold", urgent ? "text-destructive" : "text-foreground")}>{line}</p>
            {status.focus && countdown && !countdown.expired ? (
              <div className="mt-2 flex items-baseline gap-3">
                {(["days", "hours", "minutes"] as const).map((unit) => (
                  <span key={unit} className="flex items-baseline gap-1 overflow-hidden">
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.span
                        key={countdown[unit]}
                        initial={{ y: 8, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -8, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        suppressHydrationWarning
                        className={cn("inline-block text-2xl font-bold tabular-nums", urgent ? "text-destructive" : "text-foreground")}
                      >
                        {countdown[unit]}
                      </motion.span>
                    </AnimatePresence>
                    <span className="text-xs text-muted-foreground">{unit.slice(0, 1)}</span>
                  </span>
                ))}
                <span className="ml-auto truncate text-xs text-muted-foreground">
                  {status.focusLabel} · {status.focus.label}
                </span>
              </div>
            ) : null}
          </div>

          <a
            href={exam.official_website}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex w-fit items-center gap-1.5 text-xs font-medium text-success hover:underline"
          >
            <ShieldCheck className="size-3.5" /> Official source · {exam.conducting_body}
          </a>

          <footer className="mt-auto grid grid-cols-2 gap-2">
            <Link
              to="/exam/$slug"
              params={{ slug: exam.slug }}
              className="group/btn inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-semibold text-primary-foreground transition-transform duration-200 hover:scale-[1.02] active:scale-95"
            >
              View details
              <ArrowRight className="size-3.5 transition-transform duration-200 group-hover/btn:translate-x-1" />
            </Link>
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => onToggleFollow(exam.slug)}
              aria-pressed={followed}
              aria-label={followed ? `Turn off reminders for ${exam.short_code}` : `Remind me about ${exam.short_code}`}
              className={cn(
                "inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg border px-3 text-sm font-medium transition-colors duration-200",
                followed ? "border-primary bg-primary/10 text-primary" : "bg-card hover:bg-secondary",
              )}
            >
              {followed ? <BellRing className="size-4" /> : <Bell className="size-4" />}
              {followed ? "Reminding" : "Remind me"}
            </motion.button>
            <a
              href={exam.application_url}
              target="_blank"
              rel="noreferrer noopener"
              className="col-span-2 inline-flex items-center justify-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Apply on official portal <ExternalLink className="size-3" />
            </a>
          </footer>
        </div>
      </article>
    </motion.div>
  );
}
