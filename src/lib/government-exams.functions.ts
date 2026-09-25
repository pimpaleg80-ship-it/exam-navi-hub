import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { GOVERNMENT_EXAMS, type GovernmentExam } from "@/data/government-exams";

const governmentExamRow = z.object({
  slug: z.string().min(1),
  code: z.string().min(1),
  name: z.string().min(1),
  conducting_body: z.string().min(1),
  category: z.enum([
    "civil-services",
    "staff-selection",
    "banking",
    "railways",
    "teaching",
    "police-defense",
  ]),
  state: z.string().min(1),
  application_deadline: z.string().datetime({ offset: true }),
  exam_date: z.string().datetime({ offset: true }),
  mode: z.enum(["Online", "Offline"]),
  eligibility: z.string().min(1),
  official_url: z.string().url(),
  tags: z.array(z.string()).default([]),
});

const toGovernmentExam = (row: z.infer<typeof governmentExamRow>): GovernmentExam => ({
  slug: row.slug,
  code: row.code,
  name: row.name,
  conductingBody: row.conducting_body,
  category: row.category,
  state: row.state,
  applicationDeadline: row.application_deadline,
  examDate: row.exam_date,
  mode: row.mode,
  eligibility: row.eligibility,
  officialUrl: row.official_url,
  tags: row.tags,
});

export const getGovernmentExams = createServerFn({ method: "GET" }).handler(async () => {
  if (!process.env["SUPABASE_URL"] || !process.env["SUPABASE_SERVICE_ROLE_KEY"]) {
    return { exams: GOVERNMENT_EXAMS, source: "local-fallback" as const };
  }

  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("government_exams")
      .select(
        "slug,code,name,conducting_body,category,state,application_deadline,exam_date,mode,eligibility,official_url,tags",
      )
      .order("application_deadline", { ascending: true });

    if (error) throw error;
    const parsed = z.array(governmentExamRow).safeParse(data ?? []);
    if (!parsed.success || parsed.data.length === 0) {
      console.warn("[Government exams] Supabase data is empty or invalid; using local fallback.");
      return { exams: GOVERNMENT_EXAMS, source: "local-fallback" as const };
    }

    return {
      exams: parsed.data.map(toGovernmentExam),
      source: "supabase" as const,
    };
  } catch (error) {
    console.warn("[Government exams] Supabase feed unavailable; using local fallback.", error);
    return { exams: GOVERNMENT_EXAMS, source: "local-fallback" as const };
  }
});
