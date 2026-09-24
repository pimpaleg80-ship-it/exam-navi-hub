import { createHash } from "node:crypto";

import { EXAMS } from "@/data/exams";
import { GOVERNMENT_EXAMS } from "@/data/government-exams";

export type MonitorSource = {
  name: string;
  organization: string;
  exam_id: string;
  source_url: string;
  source_type: "official_page";
};

export type MonitorResult = {
  source: MonitorSource;
  status: "changed" | "unchanged" | "failed";
  httpStatus?: number;
  contentHash?: string;
  lastModified?: string;
  etag?: string;
  title?: string;
  summary?: string;
  notificationType?: string;
  errorMessage?: string;
};

const sourceRows = new Map<string, MonitorSource>();
for (const exam of EXAMS) {
  sourceRows.set(exam.official_website, {
    name: exam.short_code,
    organization: exam.conducting_body,
    exam_id: exam.slug,
    source_url: exam.official_website,
    source_type: "official_page",
  });
}
for (const exam of GOVERNMENT_EXAMS) {
  sourceRows.set(exam.officialUrl, {
    name: exam.code,
    organization: exam.conductingBody,
    exam_id: exam.slug,
    source_url: exam.officialUrl,
    source_type: "official_page",
  });
}

export const OFFICIAL_MONITOR_SOURCES = [...sourceRows.values()];

const notificationType = (text: string) => {
  const value = text.toLowerCase();
  if (/admit.?card|hall ticket/.test(value)) return "ADMIT_CARD";
  if (/result|scorecard|merit list/.test(value)) return "RESULT";
  if (/answer key|response sheet/.test(value)) return "ANSWER_KEY";
  if (/correction/.test(value)) return "CORRECTION";
  if (/registration|application|apply/.test(value)) return "REGISTRATION";
  if (/syllabus/.test(value)) return "SYLLABUS";
  if (/exam date|schedule|rescheduled|postponed|延期/.test(value)) return "EXAM_DATE";
  return "IMPORTANT_NOTICE";
};

export async function checkOfficialSource(
  source: MonitorSource,
  previous?: { etag?: string | null; lastModified?: string | null; contentHash?: string | null },
): Promise<MonitorResult> {
  const headers = new Headers({
    Accept: "text/html,application/xhtml+xml,application/pdf;q=0.9,*/*;q=0.5",
    "User-Agent": "EXAM-ALERT-INDIA-monitor/1.0 (+https://www.examalertindiaonline.com/contact)",
  });
  if (previous?.etag) headers.set("If-None-Match", previous.etag);
  if (previous?.lastModified) headers.set("If-Modified-Since", previous.lastModified);

  try {
    const response = await fetch(source.source_url, {
      headers,
      redirect: "follow",
      signal: AbortSignal.timeout(20_000),
    });
    if (response.status === 304) return { source, status: "unchanged", httpStatus: 304 };
    if (!response.ok) {
      return {
        source,
        status: "failed",
        httpStatus: response.status,
        errorMessage: `Official source returned HTTP ${response.status}`,
      };
    }

    const body = await response.text();
    const contentHash = createHash("sha256").update(body).digest("hex");
    if (contentHash === previous?.contentHash) {
      return {
        source,
        status: "unchanged",
        httpStatus: response.status,
        contentHash,
        lastModified: response.headers.get("last-modified") ?? undefined,
        etag: response.headers.get("etag") ?? undefined,
      };
    }

    const text = body
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    const summary = text.slice(0, 280);
    return {
      source,
      status: "changed",
      httpStatus: response.status,
      contentHash,
      lastModified: response.headers.get("last-modified") ?? undefined,
      etag: response.headers.get("etag") ?? undefined,
      title: `${source.name} official notification updated`,
      summary: summary || `A change was detected on the official ${source.organization} website.`,
      notificationType: notificationType(text),
    };
  } catch (error) {
    return {
      source,
      status: "failed",
      errorMessage: error instanceof Error ? error.message : "Unknown monitor failure",
    };
  }
}
