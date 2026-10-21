import { EXAMS } from "./exams";

export type ExamSource = {
  exam_slug: string;
  official_url: string;
  application_url: string;
  conducting_body: string;
  source_name: string;
  updated_at: string;
};

/** Local safety net for environments where Supabase is not configured. */
export const EXAM_SOURCES: ExamSource[] = EXAMS.map((exam) => ({
  exam_slug: exam.slug,
  official_url: exam.official_website,
  application_url: exam.application_url,
  conducting_body: exam.conducting_body,
  source_name: `${exam.short_code} official website`,
  updated_at: new Date(0).toISOString(),
}));
