import { createFileRoute } from "@tanstack/react-router";
import { EXAMS } from "@/data/exams";
import { planTriggers } from "@/lib/notification-scheduler";

/**
 * Hourly cron target (Upstash QStash / pg_cron / Inngest).
 * Secured by a shared secret header, never by route placement.
 *
 *   curl -X POST https://<project>.lovable.app/api/public/cron/dispatch-notifications \
 *        -H "x-cron-secret: $CRON_SECRET"
 */
export const Route = createFileRoute("/api/public/cron/dispatch-notifications")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env["CRON_SECRET"];
        if (!secret || request.headers.get("x-cron-secret") !== secret) {
          return new Response("Unauthorized", { status: 401 });
        }

        const now = new Date();
        let planned = 0;
        const due: string[] = [];

        for (const exam of EXAMS) {
          for (const date of exam.dates) {
            const triggers = planTriggers({
              eventType: date.event_type.toUpperCase(),
              examName: exam.short_code,
              examSlug: exam.slug,
              startDatetime: new Date(date.start_datetime),
              now,
            });
            planned += triggers.length;
            for (const t of triggers) {
              // Within this hour's window → hand to FCM in the real pipeline.
              if (t.scheduledAt.getTime() - now.getTime() <= 3_600_000) {
                due.push(`${exam.slug}:${t.triggerKey}`);
              }
            }
          }
        }

        return Response.json({ ok: true, ran_at: now.toISOString(), planned, due });
      },
    },
  },
});
