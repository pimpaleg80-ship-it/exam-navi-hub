import { createFileRoute } from "@tanstack/react-router";

import { authenticateCronRequest } from "@/integrations/supabase/cron-auth";

type VerificationInput = {
  notification_id: string;
  source_id: string;
  exam_slug: string;
  year: number;
  event_type: string;
  label?: string;
  start_datetime?: string;
  end_datetime?: string | null;
  is_tentative?: boolean;
  is_extended?: boolean;
  source_url: string;
  note?: string;
  history?: Array<{ field_name: string; old_value?: string | null; new_value?: string | null }>;
};

function supabaseConfig() {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_SERVICE_ROLE_KEY"];
  if (!url || !key) throw new Error("Supabase server configuration is incomplete");
  return { url, key };
}

async function supabaseRequest<T>(
  table: string,
  init: { method?: string; query?: string; body?: unknown; prefer?: string },
): Promise<T> {
  const { url, key } = supabaseConfig();
  const response = await fetch(`${url}/rest/v1/${table}${init.query ?? ""}`, {
    method: init.method ?? "GET",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: init.prefer ?? "return=representation",
    },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  });
  if (!response.ok)
    throw new Error(`Supabase ${table} request failed with HTTP ${response.status}`);
  return (await response.json()) as T;
}

export const Route = createFileRoute("/api/internal/verify-notification")({
  staticData: { sitemap: false },
  server: {
    handlers: {
      POST: async ({ request }) => {
        const unauthorized = await authenticateCronRequest(request);
        if (unauthorized) {
          unauthorized.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
          return unauthorized;
        }

        try {
          const input = (await request.json()) as VerificationInput;
          if (
            !input.notification_id ||
            !input.source_id ||
            !input.exam_slug ||
            !Number.isInteger(input.year) ||
            !input.event_type ||
            !input.source_url
          ) {
            return Response.json(
              { ok: false, error: "Invalid verification payload" },
              { status: 400 },
            );
          }

          await supabaseRequest("exam_notifications", {
            method: "PATCH",
            query: `?id=eq.${encodeURIComponent(input.notification_id)}`,
            body: {
              status: "VERIFIED",
              is_verified: true,
              is_new: true,
              updated_at: new Date().toISOString(),
            },
          });

          await supabaseRequest("exam_date_revisions", {
            method: "POST",
            query: "?on_conflict=exam_slug,year,event_type",
            prefer: "resolution=merge-duplicates,return=representation",
            body: {
              exam_slug: input.exam_slug,
              year: input.year,
              event_type: input.event_type,
              label: input.label ?? null,
              start_datetime: input.start_datetime ?? null,
              end_datetime: input.end_datetime ?? null,
              is_tentative: input.is_tentative ?? false,
              is_extended: input.is_extended ?? false,
              source_url: input.source_url,
              note: input.note ?? null,
              status: "VERIFIED",
              verified_at: new Date().toISOString(),
            },
          });

          if (input.history?.length) {
            await supabaseRequest("exam_update_history", {
              method: "POST",
              body: input.history.map((change) => ({
                exam_id: input.exam_slug,
                field_name: change.field_name,
                old_value: change.old_value ?? null,
                new_value: change.new_value ?? null,
                source_id: input.source_id,
                source_url: input.source_url,
              })),
            });
          }

          return Response.json(
            { ok: true, exam_slug: input.exam_slug, year: input.year },
            { headers: { "X-Robots-Tag": "noindex, nofollow, noarchive" } },
          );
        } catch (error) {
          console.error("[exam-monitor] verification failed", error);
          return Response.json(
            { ok: false, error: error instanceof Error ? error.message : "Verification failed" },
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
