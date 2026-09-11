import type { EventType } from "./exams";

/**
 * Official date revisions, keyed by exam + attempt year + event.
 *
 * This is the server-side feed the app polls. Today it is an editable file
 * (admin CMS writes here); once Lovable Cloud is enabled the same shape comes
 * from the `exam_dates` table / official-bulletin scraper, and nothing on the
 * client changes.
 */
export type ExamRevision = {
  exam_slug: string;
  /** Admission cycle these dates belong to. */
  year: number;
  event_type: EventType;
  label?: string;
  start_datetime?: string;
  end_datetime?: string | null;
  is_tentative?: boolean;
  is_extended?: boolean;
  /** Remove this milestone from the timeline. */
  removed?: boolean;
  /** When the revision was confirmed against the official source. */
  revised_at: string;
  source_url?: string;
  note?: string;
};

/**
 * No confirmed revisions yet — seeded planning dates are still current.
 * Append entries here (or from the CMS) and every client picks them up on its
 * next sync tick without a redeploy of the catalog.
 */
export const EXAM_REVISIONS: ExamRevision[] = [];
