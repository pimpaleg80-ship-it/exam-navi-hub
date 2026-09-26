import type { Exam, ExamDate } from "@/data/exams";
import type { ExamRevision } from "@/data/exam-revisions";
import type { ExamSource } from "@/data/exam-sources";

const keyOf = (slug: string, event: string) => `${slug}::${event}`;

const isValidIso = (value: unknown): value is string =>
  typeof value === "string" && !Number.isNaN(new Date(value).getTime());

/** Drop malformed feed rows so one bad entry can never break the merge. */
export function sanitizeRevisions(revisions: unknown): ExamRevision[] {
  if (!Array.isArray(revisions)) return [];
  return revisions.filter((r): r is ExamRevision => {
    if (!r || typeof r !== "object") return false;
    const rev = r as Partial<ExamRevision>;
    if (typeof rev.exam_slug !== "string" || rev.exam_slug.length === 0) return false;
    if (typeof rev.event_type !== "string" || rev.event_type.length === 0) return false;
    if (typeof rev.year !== "number" || !Number.isInteger(rev.year)) return false;
    if (rev.start_datetime !== undefined && !isValidIso(rev.start_datetime)) return false;
    if (
      rev.end_datetime !== undefined &&
      rev.end_datetime !== null &&
      !isValidIso(rev.end_datetime)
    )
      return false;
    if (typeof rev.revised_at !== "string") return false;
    return true;
  });
}

/** Merge official date revisions onto a projected exam catalog. Never throws. */
export function applyRevisions(exams: Exam[] | undefined, revisions: ExamRevision[]): Exam[] {
  const base = Array.isArray(exams) ? exams : [];
  if (revisions.length === 0) return base;

  const byExam = new Map<string, ExamRevision[]>();
  for (const r of revisions) {
    const list = byExam.get(r.exam_slug) ?? [];
    list.push(r);
    byExam.set(r.exam_slug, list);
  }

  return base.map((exam) => {
    const list = byExam.get(exam.slug);
    if (!list?.length) return exam;

    const patch = new Map(list.map((r) => [keyOf(r.exam_slug, r.event_type), r]));
    const dates: ExamDate[] = [];

    for (const date of exam.dates) {
      const r = patch.get(keyOf(exam.slug, date.event_type));
      if (!r) {
        dates.push(date);
        continue;
      }
      patch.delete(keyOf(exam.slug, date.event_type));
      if (r.removed) continue;
      const merged: ExamDate = {
        ...date,
        ...(r.label ? { label: r.label } : {}),
        ...(r.start_datetime ? { start_datetime: r.start_datetime } : {}),
        ...(r.end_datetime ? { end_datetime: r.end_datetime } : {}),
        ...(r.is_tentative === undefined ? {} : { is_tentative: r.is_tentative }),
        ...(r.is_extended === undefined ? {} : { is_extended: r.is_extended }),
      };
      if (r.end_datetime === null) delete merged.end_datetime;
      dates.push(merged);
    }

    // Revisions for milestones the seed catalog does not have yet.
    for (const r of patch.values()) {
      if (r.removed || !r.start_datetime) continue;
      dates.push({
        event_type: r.event_type,
        label: r.label ?? r.event_type.replace(/_/g, " "),
        start_datetime: r.start_datetime,
        ...(r.end_datetime ? { end_datetime: r.end_datetime } : {}),
        is_tentative: r.is_tentative ?? false,
        ...(r.is_extended ? { is_extended: true } : {}),
      });
    }

    dates.sort(
      (a, b) => new Date(a.start_datetime).getTime() - new Date(b.start_datetime).getTime(),
    );
    return { ...exam, dates };
  });
}

export function sanitizeSources(sources: unknown): ExamSource[] {
  if (!Array.isArray(sources)) return [];
  return sources.filter((source): source is ExamSource => {
    if (!source || typeof source !== "object") return false;
    const value = source as Partial<ExamSource>;
    return (
      typeof value.exam_slug === "string" &&
      value.exam_slug.length > 0 &&
      typeof value.official_url === "string" &&
      value.official_url.startsWith("http") &&
      typeof value.application_url === "string" &&
      value.application_url.startsWith("http") &&
      typeof value.conducting_body === "string" &&
      typeof value.source_name === "string" &&
      typeof value.updated_at === "string" &&
      isValidIso(value.updated_at)
    );
  });
}

export function applySources(exams: Exam[] | undefined, sources: ExamSource[]): Exam[] {
  const base = Array.isArray(exams) ? exams : [];
  if (sources.length === 0) return base;
  const bySlug = new Map(sources.map((source) => [source.exam_slug, source]));
  return base.map((exam) => {
    const source = bySlug.get(exam.slug);
    return source
      ? {
          ...exam,
          official_website: source.official_url,
          application_url: source.application_url,
          conducting_body: source.conducting_body || exam.conducting_body,
        }
      : exam;
  });
}

export function formatSyncedAgo(iso: string | undefined, now = Date.now()) {
  if (!iso) return "syncing…";
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return "syncing…";
  const secs = Math.max(0, Math.round((now - t) / 1000));
  if (secs < 60) return "just now";
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  return `${Math.floor(hrs / 24)} d ago`;
}
