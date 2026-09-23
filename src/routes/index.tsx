import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, ArrowUpRight, Bell, CalendarClock, RefreshCw, Search } from "lucide-react";
import {
  ATTEMPT_YEARS,
  BASE_CYCLE_YEAR,
  CATEGORY_META,
  examsForCycle,
  STATES,
  type ExamCategory,
  type Stream,
} from "@/data/exams";
import { ExamCard } from "@/components/exam-card";
import { getExamStatus, nextMilestone } from "@/lib/exam-status";
import { useAttemptYear, useLocalList } from "@/hooks/use-tracker";
import { useExamSync } from "@/hooks/use-exam-sync";
import { formatSyncedAgo } from "@/lib/exam-sync";
import { RouteError } from "@/components/route-error";
import { SITE_URL, examEventJsonLd, examListJsonLd } from "@/lib/exam-jsonld";
import { cn } from "@/lib/utils";
import { AdSlot } from "@/components/ad-slot";
import { AD_SLOTS } from "@/lib/adsense";

export const Route = createFileRoute("/")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: "EXAM ALERT INDIA — PCMB Exam Deadline Tracker for Indian Students" },
      {
        name: "description",
        content:
          "Track registration windows, admit cards and results for JEE, NEET, NDA, IISER and every state CET. Never miss a PCMB deadline again.",
      },
      { property: "og:title", content: "EXAM ALERT INDIA — PCMB Exam Deadline Tracker" },
      {
        property: "og:description",
        content:
          "Countdown timers and alerts for engineering, medical, defense, research and state CET entrance exams.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: SITE_URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(examListJsonLd(examsForCycle(BASE_CYCLE_YEAR))),
      },
      ...examsForCycle(BASE_CYCLE_YEAR).flatMap((exam) =>
        (exam.dates ?? [])
          .map((date, i) => examEventJsonLd(exam, date, i))
          .filter((x): x is NonNullable<typeof x> => Boolean(x))
          .map((event) => ({
            type: "application/ld+json",
            children: JSON.stringify(event),
          })),
      ),
    ],
  }),
  errorComponent: RouteError,
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
  const [year, setYear] = useAttemptYear(BASE_CYCLE_YEAR);
  const { exams: cycleExams, syncedAt, isSyncing, refresh } = useExamSync(year);

  const exams = useMemo(() => {
    const q = query.trim().toLowerCase();
    return cycleExams
      .filter((e) => {
        if (!e || typeof e.slug !== "string") return false;
        if (stream !== "all" && !(e.streams ?? []).includes(stream)) return false;
        if (category !== "all" && e.category !== category) return false;
        if (state !== "All India" && e.state && e.state !== state) return false;
        if (onlyFollowed && !follow.has(e.slug)) return false;
        const haystack = `${e.short_code ?? ""} ${e.full_name ?? ""} ${e.conducting_body ?? ""}`;
        if (q && !haystack.toLowerCase().includes(q)) return false;
        return true;
      })
      .sort((a, b) => {
        const am = nextMilestone(a, now);
        const bm = nextMilestone(b, now);
        if (!am && !bm) return 0;
        if (!am) return 1;
        if (!bm) return -1;
        const at = new Date(am.start_datetime).getTime();
        const bt = new Date(bm.start_datetime).getTime();
        if (Number.isNaN(at)) return 1;
        if (Number.isNaN(bt)) return -1;
        return at - bt;
      });
  }, [cycleExams, stream, category, state, query, onlyFollowed, follow, now]);

  const openCount = exams.filter((e) => {
    const k = getExamStatus(e, now).key;
    return k === "registration_open" || k === "last_48h";
  }).length;
  const urgentCount = exams.filter((e) => getExamStatus(e, now).key === "last_48h").length;

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#081a33]">
      <header className="border-b border-white/10 bg-[#081a33] text-white shadow-[0_18px_50px_-28px_rgba(8,26,51,0.75)]">
        <nav className="border-b border-slate-200 bg-white text-[#081a33]">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-4 py-3 sm:px-8">
            <Link
              to="/"
              className="group inline-flex items-center gap-3"
              aria-label="EXAM ALERT INDIA home"
            >
              <span className="grid size-10 place-items-center bg-[#2d64eb] text-white shadow-[4px_4px_0_#081a33]">
                <Bell className="size-5" strokeWidth={2.5} />
              </span>
              <span className="text-lg font-black tracking-[-0.06em] sm:text-xl">
                EXAM<span className="text-[#2d64eb]"> ALERT INDIA</span>
              </span>
            </Link>
            <div className="hidden items-center gap-8 text-xs font-bold uppercase tracking-[0.22em] md:flex">
              <a href="#exams" className="transition-colors hover:text-[#2d64eb]">
                Exams
              </a>
              <a href="#how-it-works" className="transition-colors hover:text-[#2d64eb]">
                How it works
              </a>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <a
                href="#exams"
                className="hidden text-xs font-bold uppercase tracking-[0.18em] hover:text-[#2d64eb] sm:inline"
              >
                Track exams
              </a>
              <Link
                to="/government"
                className="inline-flex items-center gap-2 bg-[#2d64eb] px-3 py-2.5 text-xs font-bold uppercase tracking-[0.16em] text-white shadow-[4px_4px_0_#081a33] transition hover:-translate-y-0.5 hover:bg-[#2456d1]"
              >
                Govt. exams <ArrowUpRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </nav>
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div>
            <p className="animate-fade-in text-xs font-bold uppercase tracking-[0.24em] text-[#b5c4d9]">
              <span className="mr-2 inline-block size-3 bg-[#2d64eb] align-[-1px]" />
              Centralized exam intelligence · India
            </p>
            <h1 className="mt-7 max-w-3xl text-5xl font-black uppercase leading-[0.9] tracking-[-0.065em] text-white text-balance sm:text-7xl lg:text-[6.6rem]">
              Never miss an
              <span className="mt-2 block w-fit bg-[#2d64eb] px-2 pb-3 pt-1">exam update</span>
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-[#c5d1e1] sm:text-lg">
              JEE Main, NEET, MHT-CET, IISER, NEST, CUET, NDA, UPSC, SSC, Railways and Banking —
              every official date, notice and result, verified and in one place.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#exams"
                className="inline-flex items-center gap-2 bg-[#2d64eb] px-5 py-3.5 text-xs font-bold uppercase tracking-[0.18em] text-white shadow-[5px_5px_0_#061227] transition hover:-translate-y-0.5 hover:bg-[#2456d1]"
              >
                Browse exams <ArrowRight className="size-4" />
              </a>
              <Link
                to="/government"
                className="inline-flex items-center gap-2 border border-white/70 px-5 py-3.5 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:bg-white hover:text-[#081a33]"
              >
                Government & civil services
              </Link>
            </div>
          </div>
          <div className="relative hidden min-h-[390px] lg:block">
            <div className="absolute inset-4 rotate-2 border border-[#41658d] bg-[#102b4d] shadow-[12px_12px_0_#2d64eb]" />
            <div className="absolute inset-0 overflow-hidden border border-[#6e8aaa] bg-[#173a62]">
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=85"
                alt="Students studying together around a table"
                width={1200}
                height={800}
                fetchPriority="high"
                className="absolute inset-0 size-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#081a33] via-[#081a33]/40 to-transparent" />
              <div className="absolute inset-x-5 bottom-5">
                <div className="flex items-center justify-between border-b border-white/25 pb-3">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-white">
                    Live exam radar
                  </span>
                  <span className="flex items-center gap-2 text-xs font-semibold text-white">
                    <span className="size-2 animate-pulse rounded-full bg-[#58d68d]" /> Updated
                    today
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {[
                    ["JEE Main", "28 Oct 2026"],
                    ["NEET UG", "07 Mar 2027"],
                    ["UPSC CSE", "30 May 2027"],
                  ].map(([name, date]) => (
                    <div
                      key={name}
                      className="border border-white/15 bg-[#081a33]/85 p-3 backdrop-blur-sm"
                    >
                      <p className="text-xs font-bold text-white">{name}</p>
                      <p className="mt-1 text-[10px] font-semibold text-[#9fc0ff]">{date}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#d0dbea]">
                  <CalendarClock className="size-3.5 text-[#6fa0ff]" /> Dates in IST · Official
                  portals linked
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px border-t border-white/10 bg-white/10 sm:grid-cols-4">
          <HeroStat value={cycleExams.length} label="Exams tracked" />
          <HeroStat value={openCount} label="Registration open" />
          <HeroStat value={urgentCount} label="Closing in 48 hrs" />
          <button
            type="button"
            onClick={() => refresh()}
            className="flex items-center justify-center gap-2 bg-[#081a33] px-3 py-4 text-xs font-bold uppercase tracking-[0.1em] text-[#c5d1e1] transition hover:bg-[#102b4d]"
          >
            <RefreshCw className={cn("size-4 text-[#6fa0ff]", isSyncing && "animate-spin")} />
            Synced {formatSyncedAgo(syncedAt, now)}
          </button>
        </div>
      </header>

      <section
        id="exams"
        className="sticky top-0 z-10 border-b border-white/10 bg-[#081a33]/95 text-white shadow-soft backdrop-blur-xl"
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4">
          <div className="flex flex-wrap items-center gap-3">
            <label className="relative flex-1 min-w-[200px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <span className="sr-only">Search exams</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search exams"
                placeholder="Search exam, body or code"
                className="w-full rounded-lg border border-white/20 bg-[#102b4d] py-2 pl-9 pr-3 text-sm text-white shadow-sm outline-none placeholder:text-[#aebed3] transition-[border-color,box-shadow] focus:border-[#6fa0ff] focus:ring-2 focus:ring-[#6fa0ff]/30"
              />
            </label>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="rounded-lg border border-white/20 bg-[#102b4d] px-3 py-2 text-sm font-medium text-white shadow-sm outline-none transition-[border-color,box-shadow] focus:border-[#6fa0ff] focus:ring-2 focus:ring-[#6fa0ff]/30"
              aria-label="Attempt year"
            >
              {ATTEMPT_YEARS.map((y) => (
                <option key={y} value={y}>
                  Attempt {y}
                </option>
              ))}
            </select>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="rounded-lg border border-white/20 bg-[#102b4d] px-3 py-2 text-sm text-white shadow-sm outline-none transition-[border-color,box-shadow] focus:border-[#6fa0ff] focus:ring-2 focus:ring-[#6fa0ff]/30"
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
                "rounded-lg border px-3 py-2 text-sm font-medium shadow-sm transition-[transform,color,background-color,box-shadow] duration-200 hover:-translate-y-0.5 active:translate-y-0",
                onlyFollowed
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-white/20 bg-[#102b4d] text-white hover:bg-[#173a62]",
              )}
            >
              My alerts ({follow.items.length})
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            <Chip active={stream === "all"} onClick={() => setStream("all")}>
              All streams
            </Chip>
            {STREAMS.map((s) => (
              <Chip key={s} active={stream === s} onClick={() => setStream(s)}>
                {s}
              </Chip>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <Chip active={category === "all"} onClick={() => setCategory("all")}>
              All categories
            </Chip>
            {CATEGORIES.map((c) => (
              <Chip key={c} active={category === c} onClick={() => setCategory(c)}>
                {CATEGORY_META[c].label}
              </Chip>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <h2 className="mb-4 scroll-mt-24 text-xl font-semibold tracking-tight text-white">
          Exam calendar {year} — {exams.length} exam{exams.length === 1 ? "" : "s"}
        </h2>
        {exams.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-white/20 bg-[#102b4d] p-10 text-center text-sm text-[#c5d1e1]">
            No exams match these filters yet. Try widening the stream or state.
          </p>
        ) : (
          <div className="reveal-grid grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
        <AdSlot slot={AD_SLOTS.homeInFeed} className="mt-8" />
        <p id="how-it-works" className="mt-8 scroll-mt-24 text-xs text-[#aebed3]">
          Dates marked tentative are planning estimates until the official bulletin is published.
          Always confirm on the conducting body's website before paying a fee.
        </p>
      </div>
    </main>
  );
}

function HeroStat({ value, label }: { value: number; label: string }) {
  return (
    <div className="bg-[#081a33] px-4 py-4 text-center sm:text-left">
      <p className="text-2xl font-black tabular-nums text-white">{value}</p>
      <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#aebed3]">
        {label}
      </p>
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
        "rounded-full border px-3 py-1.5 text-xs font-medium transition-[transform,color,background-color,box-shadow] duration-200 hover:-translate-y-0.5 active:translate-y-0",
        active
          ? "border-primary bg-primary text-primary-foreground shadow-sm"
          : "border-white/20 bg-[#102b4d] text-[#c5d1e1] hover:bg-[#173a62] hover:text-white hover:shadow-sm",
      )}
    >
      {children}
    </button>
  );
}
