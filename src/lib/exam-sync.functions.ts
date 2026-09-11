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
    const revisions: ExamRevision[] = EXAM_REVISIONS.filter((r) => r.year === data.year).sort(
      (a, b) => a.revised_at.localeCompare(b.revised_at),
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
