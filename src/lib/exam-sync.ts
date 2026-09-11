import type { Exam, ExamDate } from "@/data/exams";
import type { ExamRevision } from "@/data/exam-revisions";

const keyOf = (slug: string, event: string) => `${slug}::${event}`;

/** Merge official date revisions onto a projected exam catalog. */
export function applyRevisions(exams: Exam[], revisions: ExamRevision[]): Exam[] {
  if (revisions.length === 0) return exams;

  const byExam = new Map<string, ExamRevision[]>();
  for (const r of revisions) {
    const list = byExam.get(r.exam_slug) ?? [];
    list.push(r);
    byExam.set(r.exam_slug, list);
  }

  return exams.map((exam) => {
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

export function formatSyncedAgo(iso: string | undefined, now = Date.now()) {
  if (!iso) return "syncing…";
  const secs = Math.max(0, Math.round((now - new Date(iso).getTime()) / 1000));
  if (secs < 60) return "just now";
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  return `${Math.floor(hrs / 24)} d ago`;
}
