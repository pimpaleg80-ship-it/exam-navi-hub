import type { Exam, ExamDate } from "@/data/exams";

export type StatusKey =
  | "upcoming"
  | "registration_open"
  | "last_48h"
  | "closed"
  | "admit_card_live"
  | "result_out";

export type ExamStatus = {
  key: StatusKey;
  label: string;
  /** The date driving the countdown, if any. */
  focus?: ExamDate | undefined;
  focusLabel?: string | undefined;
};


const at = (iso: string) => new Date(iso).getTime();

export function getExamStatus(exam: Exam, now = Date.now()): ExamStatus {
  const byType = (t: ExamDate["event_type"]) =>
    exam.dates.filter((x) => x.event_type === t);

  const opens = byType("registration_open").sort((a, b) => at(a.start_datetime) - at(b.start_datetime));
  const closes = byType("registration_close").sort((a, b) => at(a.start_datetime) - at(b.start_datetime));
  const admit = byType("admit_card")[0];
  const result = byType("result")[0];

  const nextClose = closes.find((c) => at(c.start_datetime) > now);
  const nextOpen = opens.find((o) => at(o.start_datetime) > now);
  const openedAlready = opens.some((o) => at(o.start_datetime) <= now);

  if (nextClose && openedAlready) {
    const hoursLeft = (at(nextClose.start_datetime) - now) / 3_600_000;
    if (hoursLeft <= 48) {
      return { key: "last_48h", label: "Last 48 hours", focus: nextClose, focusLabel: "Closes in" };
    }
    return {
      key: "registration_open",
      label: "Registration open",
      focus: nextClose,
      focusLabel: "Closes in",
    };
  }

  if (nextOpen) {
    return { key: "upcoming", label: "Upcoming", focus: nextOpen, focusLabel: "Opens in" };
  }

  if (admit && at(admit.start_datetime) <= now) {
    const exam0 = byType("exam_date")[0];
    if (!exam0 || at(exam0.end_datetime ?? exam0.start_datetime) > now) {
      return { key: "admit_card_live", label: "Admit card live", focus: exam0, focusLabel: "Exam in" };
    }
  }

  if (result && at(result.start_datetime) <= now) {
    return { key: "result_out", label: "Result out" };
  }

  if (admit) {
    return { key: "closed", label: "Registration closed", focus: admit, focusLabel: "Admit card in" };
  }

  return { key: "closed", label: "Registration closed" };
}

export function nextMilestone(exam: Exam, now = Date.now()): ExamDate | undefined {
  return [...exam.dates]
    .filter((x) => at(x.start_datetime) > now)
    .sort((a, b) => at(a.start_datetime) - at(b.start_datetime))[0];
}

export function formatCountdown(target: string, now = Date.now()) {
  const ms = new Date(target).getTime() - now;
  if (ms <= 0) return { days: 0, hours: 0, minutes: 0, expired: true };
  return {
    days: Math.floor(ms / 86_400_000),
    hours: Math.floor((ms % 86_400_000) / 3_600_000),
    minutes: Math.floor((ms % 3_600_000) / 60_000),
    expired: false,
  };
}

export const IST = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "Asia/Kolkata",
});

export const ISTTime = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Kolkata",
});
