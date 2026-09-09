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
