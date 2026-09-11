import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { examsForCycle, type Exam } from "@/data/exams";
import { getExamRevisions } from "@/lib/exam-sync.functions";
import { applyRevisions } from "@/lib/exam-sync";

/** How often every open tab re-checks the official date feed. */
export const SYNC_INTERVAL_MS = 5 * 60 * 1000;

/**
 * Keeps the visible catalog in step with the exam cycle: polls the revision
 * feed every 5 minutes, on window focus and on reconnect, and merges any
 * changed dates into the projected catalog.
 */
export function useExamSync(year: number) {
  const fetchRevisions = useServerFn(getExamRevisions);

  const query = useQuery({
    queryKey: ["exam-revisions", year],
    queryFn: () => fetchRevisions({ data: { year } }),
    refetchInterval: SYNC_INTERVAL_MS,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    staleTime: SYNC_INTERVAL_MS / 2,
  });

  const exams: Exam[] = useMemo(
    () => applyRevisions(examsForCycle(year), query.data?.revisions ?? []),
    [year, query.data],
  );

  return {
    exams,
    syncedAt: query.data?.synced_at,
    revisionCount: query.data?.count ?? 0,
    isSyncing: query.isFetching,
    error: query.error,
    refresh: () => query.refetch(),
  };
}

/** Single-exam variant for the detail page. */
export function useExamSyncFor(slug: string, year: number) {
  const sync = useExamSync(year);
  return { ...sync, exam: sync.exams.find((e) => e.slug === slug) };
}
