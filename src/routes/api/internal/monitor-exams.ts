import { createFileRoute } from "@tanstack/react-router";

import { authenticateCronRequest } from "@/integrations/supabase/cron-auth";
import {
  checkOfficialSource,
  OFFICIAL_MONITOR_SOURCES,
  type MonitorSource,
} from "@/lib/notification-monitor";

type SourceRow = MonitorSource & {
  id: string;
  last_content_hash: string | null;
  last_modified: string | null;
  etag: string | null;
  status: string;
};

function supabaseConfig() {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_SERVICE_ROLE_KEY"];
  if (!url || !key) throw new Error("Supabase server configuration is incomplete");
  return { url, key };
}

async function supabaseRequest<T>(
  table: string,
  init: { method?: string; query?: string; body?: unknown },
): Promise<T> {
  const { url, key } = supabaseConfig();
  const response = await fetch(`${url}/rest/v1/${table}${init.query ?? ""}`, {
    method: init.method ?? "GET",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  });
  if (!response.ok) {
    throw new Error(`Supabase ${table} request failed with HTTP ${response.status}`);
  }
  return (await response.json()) as T;
}

async function monitorSources() {
  const existing = await supabaseRequest<SourceRow[]>("official_sources", {
    query: "?select=*&order=source_url.asc",
  });
  const byUrl = new Map(existing.map((source) => [source.source_url, source]));

  for (const source of OFFICIAL_MONITOR_SOURCES) {
    if (!byUrl.has(source.source_url)) {
      const inserted = await supabaseRequest<SourceRow[]>("official_sources", {
        method: "POST",
        body: source,
      });
      if (inserted[0]) byUrl.set(source.source_url, inserted[0]);
    }
  }

  const results = [];
  for (const source of OFFICIAL_MONITOR_SOURCES) {
    const row = byUrl.get(source.source_url);
    if (!row || row.status === "disabled") continue;
    const result = await checkOfficialSource(source, {
      etag: row.etag,
      lastModified: row.last_modified,
      contentHash: row.last_content_hash,
    });

    await supabaseRequest("source_monitor_logs", {
      method: "POST",
      body: {
        source_id: row.id,
        status: result.status === "failed" ? "failed" : result.status,
        http_status: result.httpStatus ?? null,
        error_message: result.errorMessage ?? null,
        items_found: result.status === "changed" ? 1 : 0,
      },
    });

    await supabaseRequest("official_sources", {
      method: "PATCH",
      query: `?id=eq.${encodeURIComponent(row.id)}`,
      body: {
        last_checked_at: new Date().toISOString(),
        ...(result.status === "failed"
          ? { status: "failed" }
          : {
              status: result.status,
              last_success_at: new Date().toISOString(),
              last_content_hash: result.contentHash ?? row.last_content_hash,
              last_modified: result.lastModified ?? row.last_modified,
              etag: result.etag ?? row.etag,
            }),
      },
    });

    if (result.status === "changed" && result.contentHash && result.title && result.summary) {
      await supabaseRequest("exam_notifications", {
        method: "POST",
        body: {
          exam_id: source.exam_id,
          source_id: row.id,
          title: result.title,
          summary: result.summary,
          notification_type: result.notificationType ?? "IMPORTANT_NOTICE",
          official_url: source.source_url,
          content_hash: result.contentHash,
          is_new: true,
          is_verified: false,
          status: "PENDING_VERIFICATION",
        },
      });
    }

    results.push({
      exam_id: source.exam_id,
      status: result.status,
      http_status: result.httpStatus ?? null,
      error: result.errorMessage ?? null,
    });
  }
  return results;
}

export const Route = createFileRoute("/api/internal/monitor-exams")({
  staticData: { sitemap: false },
  server: {
    handlers: {
      GET: async ({ request }) => {
        const unauthorized = await authenticateCronRequest(request);
        if (unauthorized) {
          unauthorized.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
          return unauthorized;
        }
        try {
          const results = await monitorSources();
          return Response.json(
            { ok: true, checked_at: new Date().toISOString(), results },
            { headers: { "X-Robots-Tag": "noindex, nofollow, noarchive" } },
          );
        } catch (error) {
          console.error("[exam-monitor] run failed", error);
          return Response.json(
            { ok: false, error: error instanceof Error ? error.message : "Monitor failed" },
            {
              status: 500,
              headers: { "X-Robots-Tag": "noindex, nofollow, noarchive" },
            },
          );
        }
      },
    },
  },
});
