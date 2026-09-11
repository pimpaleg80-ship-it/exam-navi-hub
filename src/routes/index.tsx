import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { CalendarClock, Search, ShieldCheck } from "lucide-react";
import { CATEGORY_META, EXAMS, STATES, type ExamCategory, type Stream } from "@/data/exams";
import { ExamCard } from "@/components/exam-card";
import { getExamStatus, nextMilestone } from "@/lib/exam-status";
import { useLocalList } from "@/hooks/use-tracker";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EduAlert PCMB — Exam Deadline Tracker for Indian Students" },
      {
        name: "description",
        content:
          "Track registration windows, admit cards and results for JEE, NEET, NDA, IISER and every state CET. Never miss a PCMB deadline again.",
      },
      { property: "og:title", content: "EduAlert PCMB — Exam Deadline Tracker" },
      {
        property: "og:description",
        content:
          "Countdown timers and alerts for engineering, medical, defense, research and state CET entrance exams.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const CATEGORIES = Object.keys(CATEGORY_META) as ExamCategory[];
const STREAMS: Stream[] = ["PCM", "PCB", "PCMB"];

function Dashboard() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);

  const [stream, setStream] = useState<Stream | "all">("all");
  const [category, setCategory] = useState<ExamCategory | "all">("all");
  const [state, setState] = useState("All India");
  const [query, setQuery] = useState("");
  const [onlyFollowed, setOnlyFollowed] = useState(false);

  const follow = useLocalList("followed");

  const exams = useMemo(() => {
    const q = query.trim().toLowerCase();
    return EXAMS.filter((e) => {
      if (stream !== "all" && !e.streams.includes(stream)) return false;
      if (category !== "all" && e.category !== category) return false;
      if (state !== "All India" && e.state && e.state !== state) return false;
      if (onlyFollowed && !follow.has(e.slug)) return false;
      if (q && !`${e.short_code} ${e.full_name} ${e.conducting_body}`.toLowerCase().includes(q))
        return false;
      return true;
    }).sort((a, b) => {
      const am = nextMilestone(a, now);
      const bm = nextMilestone(b, now);
      if (!am) return 1;
      if (!bm) return -1;
      return new Date(am.start_datetime).getTime() - new Date(bm.start_datetime).getTime();
    });
  }, [stream, category, state, query, onlyFollowed, follow, now]);

  const openCount = exams.filter((e) => {
    const k = getExamStatus(e, now).key;
    return k === "registration_open" || k === "last_48h";
  }).length;
  const urgentCount = exams.filter((e) => getExamStatus(e, now).key === "last_48h").length;

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            EduAlert PCMB
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Every PCMB entrance deadline, in one countdown.
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Engineering, medical, defense, research and state CET exams — registration windows,
            correction slots, admit cards and results, all on IST.
          </p>
          <div className="mt-5 flex flex-wrap gap-3 text-sm">
            <Stat icon={<CalendarClock className="size-4" />} label="Exams tracked" value={EXAMS.length} />
            <Stat icon={<ShieldCheck className="size-4" />} label="Registration open" value={openCount} />
            <Stat
              icon={<CalendarClock className="size-4" />}
              label="Closing in 48 hrs"
              value={urgentCount}
              tone={urgentCount > 0 ? "urgent" : "default"}
            />
          </div>
        </div>
      </header>

      <section className="sticky top-0 z-10 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4">
          <div className="flex flex-wrap items-center gap-3">
            <label className="relative flex-1 min-w-[200px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search exam, body or code"
                className="w-full rounded-lg border border-input bg-card py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="rounded-lg border border-input bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              aria-label="Home state"
            >
              {STATES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setOnlyFollowed((v) => !v)}
              className={cn(
                "rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                onlyFollowed
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-input bg-card hover:bg-secondary",
              )}
            >
              My alerts ({follow.items.length})
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            <Chip active={stream === "all"} onClick={() => setStream("all")}>All streams</Chip>
            {STREAMS.map((s) => (
              <Chip key={s} active={stream === s} onClick={() => setStream(s)}>
                {s}
              </Chip>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <Chip active={category === "all"} onClick={() => setCategory("all")}>All categories</Chip>
            {CATEGORIES.map((c) => (
              <Chip key={c} active={category === c} onClick={() => setCategory(c)}>
                {CATEGORY_META[c].label}
              </Chip>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-8">
        {exams.length === 0 ? (
          <p className="rounded-2xl border border-dashed p-10 text-center text-sm text-muted-foreground">
            No exams match these filters yet. Try widening the stream or state.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {exams.map((exam) => (
              <ExamCard
                key={exam.slug}
                exam={exam}
                now={now}
                followed={follow.has(exam.slug)}
                onToggleFollow={follow.toggle}
              />
            ))}
          </div>
        )}
        <p className="mt-8 text-xs text-muted-foreground">
          Dates marked tentative are planning estimates until the official bulletin is published.
          Always confirm on the conducting body's website before paying a fee.
        </p>
      </div>
    </main>
  );
}

function Stat({
  icon,
  label,
  value,
  tone = "default",
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  tone?: "default" | "urgent";
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-xl border px-3 py-2",
        tone === "urgent" && value > 0 ? "border-destructive/40 text-destructive" : "text-foreground",
      )}
    >
      {icon}
      <span className="text-lg font-bold tabular-nums">{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-input bg-card text-muted-foreground hover:bg-secondary",
      )}
    >
      {children}
    </button>
  );
}
