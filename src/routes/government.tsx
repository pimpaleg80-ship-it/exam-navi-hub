import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarClock,
  Search,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";
import { useMemo, useState } from "react";
import { GovernmentExamCard } from "@/components/government-exam-card";
import {
  GOVERNMENT_CATEGORIES,
  GOVERNMENT_EXAMS,
  GOVERNMENT_STATES,
  type GovernmentCategory,
} from "@/data/government-exams";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/government")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: "Government & Civil Services — EXAM ALERT INDIA" },
      {
        name: "description",
        content:
          "Track UPSC, SSC, banking, railways, teaching and police recruitment deadlines across India.",
      },
    ],
  }),
  component: GovernmentDashboard,
});

function GovernmentDashboard() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<GovernmentCategory | "all">("all");
  const [state, setState] = useState("All India");
  const today = Date.now();
  const daysUntil = (value: string) => Math.ceil((new Date(value).getTime() - today) / 86400000);
  const exams = useMemo(
    () =>
      GOVERNMENT_EXAMS.filter((exam) => {
        const haystack =
          `${exam.code} ${exam.name} ${exam.conductingBody} ${exam.tags.join(" ")}`.toLowerCase();
        return (
          (!query || haystack.includes(query.toLowerCase())) &&
          (category === "all" || exam.category === category) &&
          (state === "All India" || exam.state === state)
        );
      }).sort(
        (a, b) =>
          new Date(a.applicationDeadline).getTime() - new Date(b.applicationDeadline).getTime(),
      ),
    [category, query, state],
  );
  const closingSoon = GOVERNMENT_EXAMS.filter(
    (exam) => daysUntil(exam.applicationDeadline) >= 0 && daysUntil(exam.applicationDeadline) <= 30,
  );
  const openNow = GOVERNMENT_EXAMS.filter(
    (exam) => daysUntil(exam.applicationDeadline) >= 0,
  ).length;

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b bg-card/90 shadow-soft backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-5">
          <nav className="flex flex-wrap items-center justify-between gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-4" /> EXAM ALERT INDIA
            </Link>
            <div className="flex rounded-full border bg-background p-1 text-sm">
              <Link
                to="/"
                className="rounded-full px-3 py-1.5 text-muted-foreground hover:text-foreground"
              >
                PCMB entrances
              </Link>
              <span className="rounded-full bg-primary px-3 py-1.5 font-semibold text-primary-foreground">
                Government exams
              </span>
            </div>
          </nav>
          <div className="mt-10 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Government & Civil Services
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-5xl">
              Your next government career, on your radar.
            </h1>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">
              One calm dashboard for UPSC, SSC, banking, railways, teaching and uniformed services.
              Dates are local mock data for planning.
            </p>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat
              icon={<BriefcaseBusiness className="size-4" />}
              label="Exams tracked"
              value={GOVERNMENT_EXAMS.length}
            />
            <Stat
              icon={<ShieldCheck className="size-4" />}
              label="Open applications"
              value={openNow}
            />
            <Stat
              icon={<CalendarClock className="size-4" />}
              label="Closing in 30 days"
              value={closingSoon.length}
              urgent={closingSoon.length > 0}
            />
            <Stat
              icon={<SlidersHorizontal className="size-4" />}
              label="Showing"
              value={exams.length}
            />
          </div>
        </div>
      </header>
      <section className="sticky top-0 z-10 border-b bg-background/90 shadow-soft backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <span className="sr-only">Search government exams</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search UPSC, SSC, bank, railway..."
                className="w-full rounded-lg border border-input bg-card py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring/30"
              />
            </label>
            <select
              value={state}
              onChange={(event) => setState(event.target.value)}
              aria-label="Filter by state"
              className="rounded-lg border border-input bg-card px-3 py-2 text-sm"
            >
              {GOVERNMENT_STATES.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            <FilterChip active={category === "all"} onClick={() => setCategory("all")}>
              All categories
            </FilterChip>
            {(Object.keys(GOVERNMENT_CATEGORIES) as GovernmentCategory[]).map((item) => (
              <FilterChip key={item} active={category === item} onClick={() => setCategory(item)}>
                {GOVERNMENT_CATEGORIES[item].label}
              </FilterChip>
            ))}
          </div>
        </div>
      </section>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
          <section className="rounded-2xl border bg-card p-5 shadow-soft">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-primary">
                  Deadline radar
                </p>
                <h2 className="mt-1 text-xl font-bold">What needs attention next</h2>
              </div>
              <CalendarClock className="size-6 text-primary" />
            </div>
            <div className="mt-4 space-y-3">
              {closingSoon.slice(0, 3).map((exam) => (
                <div
                  key={exam.slug}
                  className="flex items-center justify-between gap-3 rounded-xl bg-secondary/60 px-3 py-2.5 text-sm"
                >
                  <span className="font-semibold">{exam.code}</span>
                  <span className="text-destructive">
                    {daysUntil(exam.applicationDeadline)} days left
                  </span>
                </div>
              ))}
              {closingSoon.length === 0 && (
                <p className="rounded-xl bg-secondary/60 p-3 text-sm text-muted-foreground">
                  No application deadlines in the next 30 days.
                </p>
              )}
            </div>
          </section>
          <section className="rounded-2xl border bg-primary p-5 text-primary-foreground shadow-soft">
            <p className="text-xs font-bold uppercase tracking-wider opacity-80">
              Explore the ecosystem
            </p>
            <h2 className="mt-1 text-xl font-bold">Plan beyond one exam</h2>
            <p className="mt-2 text-sm opacity-85">
              Compare eligibility, mode and deadlines across{" "}
              {Object.keys(GOVERNMENT_CATEGORIES).length} career tracks.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {(Object.keys(GOVERNMENT_CATEGORIES) as GovernmentCategory[])
                .slice(0, 3)
                .map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCategory(item)}
                    className="rounded-full bg-primary-foreground/15 px-3 py-1.5 text-xs font-semibold hover:bg-primary-foreground/25"
                  >
                    {GOVERNMENT_CATEGORIES[item].label}
                  </button>
                ))}
            </div>
          </section>
        </div>
        <h2 className="mb-4 text-xl font-bold tracking-tight">
          All government exams <span className="text-muted-foreground">· {exams.length}</span>
        </h2>
        {exams.length === 0 ? (
          <p className="rounded-2xl border border-dashed p-10 text-center text-sm text-muted-foreground">
            No government exams match these filters. Try another category, state or search.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {exams.map((exam) => (
              <GovernmentExamCard
                key={exam.slug}
                exam={exam}
                daysLeft={daysUntil(exam.applicationDeadline)}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function Stat({
  icon,
  label,
  value,
  urgent = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  urgent?: boolean;
}) {
  return (
    <div
      className={cn("rounded-xl border bg-background/70 px-3 py-2", urgent && "border-warning/60")}
    >
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-lg font-bold tabular-nums">{value}</span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function FilterChip({
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
        "whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-input bg-card text-muted-foreground hover:bg-secondary",
      )}
    >
      {children}
    </button>
  );
}
