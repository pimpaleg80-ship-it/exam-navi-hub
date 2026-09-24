import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { EXAM_REVISIONS, type ExamRevision } from "@/data/exam-revisions";

/**
 * Live date feed the clients poll every few minutes.
 *
 * Returns only the revisions relevant to the requested attempt year, plus a
 * server timestamp so every device computes status against the same clock.
 */
export const getExamRevisions = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) =>
    z
      .object({ year: z.number().int().min(2024).max(2040) })
      .parse(input ?? { year: new Date().getUTCFullYear() }),
  )
  .handler(async ({ data }) => {
    let revisions = EXAM_REVISIONS.filter((r) => r.year === data.year);

    if (process.env["SUPABASE_URL"] && process.env["SUPABASE_SERVICE_ROLE_KEY"]) {
      try {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data: remoteRevisions, error } = await supabaseAdmin
          .from("exam_revisions")
          .select(
            "exam_slug,year,event_type,label,start_datetime,end_datetime,is_tentative,is_extended,removed,revised_at,source_url,note",
          )
          .eq("year", data.year)
          .order("revised_at", { ascending: true });

        if (error) throw error;
        revisions = (remoteRevisions ?? []) as ExamRevision[];
      } catch (error) {
        console.warn(
          "[Exam sync] Supabase revision feed unavailable; using local revisions.",
          error,
        );
      }
    }

    return {
      year: data.year,
      synced_at: new Date().toISOString(),
      /** Server clock in ms — keeps countdowns honest on skewed devices. */
      server_now: Date.now(),
      count: revisions.length,
      revisions: revisions.sort((a, b) => a.revised_at.localeCompare(b.revised_at)),
    };
  });
