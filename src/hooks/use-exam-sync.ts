import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { examsForCycle, type Exam } from "@/data/exams";
import { getExamRevisions } from "@/lib/exam-sync.functions";
import { applyRevisions, sanitizeRevisions } from "@/lib/exam-sync";

/** How often every open tab re-checks the official date feed. */
export const SYNC_INTERVAL_MS = 5 * 60 * 1000;

/** Projected catalog for a cycle — falls back to [] if the data module fails. */
function safeCycleExams(year: number): Exam[] {
  try {
    const exams = examsForCycle(year);
    return Array.isArray(exams) ? exams : [];
  } catch {
    return [];
  }
}

export type ExamSyncState = {
  /** Always a real array, even while the feed is loading or after an error. */
  exams: Exam[];
  syncedAt: string | undefined;
  revisionCount: number;
  isSyncing: boolean;
  error: unknown;
  refresh: () => void;
};

/**
 * Keeps the visible catalog in step with the exam cycle: polls the revision
 * feed every 5 minutes, on window focus and on reconnect, and merges any
 * changed dates into the projected catalog. Guarantees `exams` is always a
 * valid array so callers can filter/sort without defensive checks.
 */
export function useExamSync(year: number): ExamSyncState {
  const fetchRevisions = useServerFn(getExamRevisions);

  const query = useQuery({
    queryKey: ["exam-revisions", year],
    queryFn: () => fetchRevisions({ data: { year } }),
    refetchInterval: SYNC_INTERVAL_MS,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    staleTime: SYNC_INTERVAL_MS / 2,
    // A flaky network must not surface as a thrown render error.
    retry: 2,
    throwOnError: false,
  });

  const exams = useMemo<Exam[]>(() => {
    const base = safeCycleExams(year);
    try {
      return applyRevisions(base, sanitizeRevisions(query.data?.revisions));
    } catch {
      return base;
    }
  }, [year, query.data]);

  return {
    exams,
    syncedAt:
      query.data && typeof query.data.synced_at === "string" ? query.data.synced_at : undefined,
    revisionCount: typeof query.data?.count === "number" ? query.data.count : 0,
    isSyncing: query.isFetching,
    error: query.error,
    refresh: () => {
      void query.refetch();
    },
  };
}

/** Single-exam variant for the detail page. */
export function useExamSyncFor(slug: string, year: number) {
  const sync = useExamSync(year);
  return { ...sync, exam: sync.exams.find((e) => e.slug === slug) };
}
