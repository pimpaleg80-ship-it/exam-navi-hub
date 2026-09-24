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
    const staticRevisions = EXAM_REVISIONS.filter((r) => r.year === data.year);
    let databaseRevisions: ExamRevision[] = [];
    const supabaseUrl = process.env["SUPABASE_URL"];
    const supabaseKey = process.env["SUPABASE_PUBLISHABLE_KEY"];

    if (supabaseUrl && supabaseKey) {
      try {
        const query = new URLSearchParams({
          select:
            "exam_slug,year,event_type,label,start_datetime,end_datetime,is_tentative,is_extended,source_url,note,updated_at",
          year: `eq.${data.year}`,
          status: "eq.VERIFIED",
          order: "updated_at.asc",
        });
        const response = await fetch(
          `${supabaseUrl}/rest/v1/exam_date_revisions?${query.toString()}`,
          { headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` } },
        );
        if (response.ok) {
          const rows = (await response.json()) as Array<
            Omit<ExamRevision, "revised_at"> & { updated_at?: string }
          >;
          databaseRevisions = rows.map((row) => ({
            ...row,
            revised_at: row.updated_at ?? new Date().toISOString(),
          }));
        }
      } catch (error) {
        console.error("[exam-sync] verified revision lookup failed", error);
      }
    }

    const revisions = [...staticRevisions, ...databaseRevisions].sort((a, b) =>
      a.revised_at.localeCompare(b.revised_at),
    );

    return {
      year: data.year,
      synced_at: new Date().toISOString(),
      /** Server clock in ms — keeps countdowns honest on skewed devices. */
      server_now: Date.now(),
      count: revisions.length,
      revisions,
    };
  });
