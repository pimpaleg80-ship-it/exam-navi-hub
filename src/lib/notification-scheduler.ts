/**
 * Deadline → notification planning (pure, testable, runtime-agnostic).
 *
 * The hourly cron worker calls `planTriggers()` for every exam_date row whose
 * start_datetime is in the future, upserts the resulting rows into
 * notifications_queue (idempotent on the unique
 * [user_id, exam_date_id, trigger_key, channel] index), then drains anything
 * with status = QUEUED and scheduled_at <= now() through FCM.
 */

export type TriggerOffset = {
  key: string;
  /** Milliseconds before the event that the push must fire. */
  leadMs: number;
  template: (examName: string) => { title: string; body: string };
};

const HOUR = 3_600_000;
const DAY = 24 * HOUR;

export const REGISTRATION_TRIGGERS: TriggerOffset[] = [
  {
    key: "T-30D",
    leadMs: 30 * DAY,
    template: (n) => ({ title: `Registration open for ${n}`, body: `Applications are live. Apply early to avoid portal load.` }),
  },
  {
    key: "T-7D",
    leadMs: 7 * DAY,
    template: (n) => ({ title: `1 week left to apply for ${n}`, body: `Registration closes in 7 days.` }),
  },
  {
    key: "T-48H",
    leadMs: 48 * HOUR,
    template: (n) => ({ title: `48 hours left — ${n}`, body: `Two days to submit your ${n} application.` }),
  },
  {
    key: "T-12H",
    leadMs: 12 * HOUR,
    template: (n) => ({ title: `Urgent: ${n} registration closes tonight`, body: `The portal shuts at 11:50 PM IST. Finish payment now.` }),
  },
];

/** Event types that fire immediately when published, with no lead time. */
export const IMMEDIATE_EVENTS = [
  "ADMIT_CARD",
  "CITY_INTIMATION_SLIP",
  "ANSWER_KEY",
  "RESULT",
  "NOTIFICATION_RELEASED",
] as const;

export type PlannedTrigger = {
  triggerKey: string;
  scheduledAt: Date;
  payload: { title: string; body: string; deepLink: string };
};

export function planTriggers(input: {
  eventType: string;
  examName: string;
  examSlug: string;
  startDatetime: Date;
  now?: Date;
}): PlannedTrigger[] {
  const now = input.now ?? new Date();
  const start = input.startDatetime.getTime();
  const deepLink = `/exam/${input.examSlug}`;

  if ((IMMEDIATE_EVENTS as readonly string[]).includes(input.eventType)) {
    return [
      {
        triggerKey: `${input.eventType}:LIVE`,
        scheduledAt: new Date(Math.max(start, now.getTime())),
        payload: {
          title: `${input.examName}: ${input.eventType.replaceAll("_", " ").toLowerCase()} is live`,
          body: `Published on the official portal — open EduAlert to download.`,
          deepLink,
        },
      },
    ];
  }

  if (input.eventType !== "REGISTRATION_CLOSE" && input.eventType !== "LATE_FEE_CLOSE") return [];

  return REGISTRATION_TRIGGERS.filter((t) => start - t.leadMs > now.getTime()).map((t) => ({
    triggerKey: `${input.eventType}:${t.key}`,
    scheduledAt: new Date(start - t.leadMs),
    payload: { ...t.template(input.examName), deepLink },
  }));
}

/**
 * DND gate: quiet hours are honoured unless the exam is one of the user's
 * three "Dream Exams", which bypass DND entirely.
 */
export function shouldDeliverNow(opts: {
  at: Date;
  dndStartHour: number;
  dndEndHour: number;
  isDreamExam: boolean;
}): { deliver: boolean; deferTo?: Date } {
  if (opts.isDreamExam) return { deliver: true };
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", { hour: "2-digit", hour12: false, timeZone: "Asia/Kolkata" }).format(opts.at),
  );
  const inDnd =
    opts.dndStartHour <= opts.dndEndHour
      ? hour >= opts.dndStartHour && hour < opts.dndEndHour
      : hour >= opts.dndStartHour || hour < opts.dndEndHour;
  if (!inDnd) return { deliver: true };
  const deferTo = new Date(opts.at);
  deferTo.setUTCHours(deferTo.getUTCHours() + ((opts.dndEndHour - hour + 24) % 24));
  return { deliver: false, deferTo };
}
