import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { EXAMS } from "@/data/exams";
import { planTriggers, shouldDeliverNow } from "./notification-scheduler";

const EVENT_TYPE_DB: Record<string, string> = {
  notification_released: "NOTIFICATION_RELEASED",
  registration_open: "REGISTRATION_OPEN",
  registration_close: "REGISTRATION_CLOSE",
  late_fee_close: "LATE_FEE_CLOSE",
  correction_window: "CORRECTION_WINDOW",
  city_slip: "CITY_INTIMATION_SLIP",
  admit_card: "ADMIT_CARD",
  exam_date: "EXAM_DATE",
  answer_key: "ANSWER_KEY",
  result: "RESULT",
  counseling: "COUNSELING",
};

/**
 * Hourly scheduler pass.
 *
 * Production wiring (once Lovable Cloud is enabled):
 *   1. select exam_dates where start_datetime > now()
 *   2. planTriggers() per row  → upsert into notifications_queue for every
 *      follower of that exam (idempotent on the unique index)
 *   3. select queue where status='QUEUED' and scheduled_at <= now()
 *   4. shouldDeliverNow() DND gate (dream exams bypass)
 *   5. POST FCM v1 /messages:send through the Lovable connector gateway,
 *      then mark SENT / FAILED and prune UNREGISTERED device tokens.
 *
 * Today it runs the same planning logic against the seeded catalog so the
 * schedule can be inspected before the database is attached.
 */
export const planNotificationQueue = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        followedSlugs: z.array(z.string()).default([]),
        dreamSlugs: z.array(z.string()).default([]),
        horizonDays: z.number().min(1).max(400).default(120),
      })
      .parse(input ?? {}),
  )
  .handler(async ({ data }) => {
    const now = new Date();
    const horizon = now.getTime() + data.horizonDays * 86_400_000;

    const queue = EXAMS.filter(
      (e) => data.followedSlugs.length === 0 || data.followedSlugs.includes(e.slug),
    ).flatMap((exam) =>
      exam.dates.flatMap((date) =>
        planTriggers({
          eventType: EVENT_TYPE_DB[date.event_type] ?? "EXAM_DATE",
          examName: exam.short_code,
          examSlug: exam.slug,
          startDatetime: new Date(date.start_datetime),
          now,
        })
          .filter((t) => t.scheduledAt.getTime() <= horizon)
          .map((t) => {
            const isDream = data.dreamSlugs.includes(exam.slug);
            const gate = shouldDeliverNow({
              at: t.scheduledAt,
              dndStartHour: 22,
              dndEndHour: 7,
              isDreamExam: isDream,
            });
            return {
              exam_slug: exam.slug,
              trigger_key: t.triggerKey,
              scheduled_at: (gate.deferTo ?? t.scheduledAt).toISOString(),
              channel: "PUSH" as const,
              is_high_priority: isDream,
              status: "QUEUED" as const,
              payload: t.payload,
            };
          }),
      ),
    );

    queue.sort((a, b) => a.scheduled_at.localeCompare(b.scheduled_at));
    return { generated_at: now.toISOString(), count: queue.length, queue: queue.slice(0, 200) };
  });
