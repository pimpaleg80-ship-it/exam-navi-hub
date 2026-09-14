import { useCallback, useEffect, useState } from "react";

type Store = Record<string, string[]>;

const KEY = "edualert.tracker.v1";

function read(): Store {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "{}") as Store;
  } catch {
    return {};
  }
}

/** Local, device-only list store (followed exams, dream exams, checklists). */
export function useLocalList(bucket: string) {
  const [items, setItems] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(read()[bucket] ?? []);
    setHydrated(true);
  }, [bucket]);

  const persist = useCallback(
    (next: string[]) => {
      setItems(next);
      const all = read();
      all[bucket] = next;
      window.localStorage.setItem(KEY, JSON.stringify(all));
    },
    [bucket],
  );

  const toggle = useCallback(
    (id: string) => {
      const current = read()[bucket] ?? [];
      persist(current.includes(id) ? current.filter((x) => x !== id) : [...current, id]);
    },
    [bucket, persist],
  );

  return { items, hydrated, toggle, has: (id: string) => items.includes(id) };
}

const YEAR_KEY = "edualert.attemptYear";

/** Attempt/admission year the student is planning for. */
export function useAttemptYear(fallback: number) {
  const [year, setYear] = useState(fallback);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = Number(window.localStorage.getItem(YEAR_KEY));
      // Reject NaN, zero and implausible years left by older versions.
      if (Number.isInteger(stored) && stored >= 2024 && stored <= 2040) setYear(stored);
    } catch {
      /* storage unavailable — keep the fallback year */
    }
  }, []);

  const update = useCallback((next: number) => {
    if (!Number.isInteger(next)) return;
    setYear(next);
    try {
      window.localStorage.setItem(YEAR_KEY, String(next));
    } catch {
      /* storage unavailable — state still updated for this session */
    }
  }, []);

  return [year, update] as const;
}
