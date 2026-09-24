import { createFileRoute } from "@tanstack/react-router";

import { SITE_URL } from "@/lib/exam-jsonld";

type NotificationRow = {
  id: string;
  exam_id: string;
  title: string;
  summary: string;
  notification_type: string;
  official_url: string;
  document_url: string | null;
  published_at: string | null;
  detected_at: string;
  is_new: boolean;
  is_verified: boolean;
};

function publicSupabaseConfig() {
  const url = process.env["SUPABASE_URL"] ?? import.meta.env["VITE_SUPABASE_URL"];
  const key =
    process.env["SUPABASE_PUBLISHABLE_KEY"] ?? import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) return undefined;
  return { url, key };
}

export const Route = createFileRoute("/api/notifications")({
  staticData: { sitemap: false },
  server: {
    handlers: {
      GET: async ({ request }) => {
        const config = publicSupabaseConfig();
        if (!config) {
          return Response.json(
            { notifications: [] },
            { headers: { "Cache-Control": "public, max-age=300" } },
          );
        }

        const requestedLimit = Number(new URL(request.url).searchParams.get("limit") ?? "6");
        const limit = Math.min(
          Math.max(Number.isFinite(requestedLimit) ? requestedLimit : 6, 1),
          20,
        );
        const query = new URLSearchParams({
          select:
            "id,exam_id,title,summary,notification_type,official_url,document_url,published_at,detected_at,is_new,is_verified",
          order: "detected_at.desc",
          limit: String(limit),
        });
        const response = await fetch(
          `${config.url}/rest/v1/exam_notifications?${query.toString()}`,
          {
            headers: { apikey: config.key, Authorization: `Bearer ${config.key}` },
          },
        );
        if (!response.ok) {
          console.error("[notifications] Supabase request failed", response.status);
          return Response.json(
            { notifications: [] },
            { status: 502, headers: { "Cache-Control": "no-store" } },
          );
        }

        const notifications = (await response.json()) as NotificationRow[];
        return Response.json(
          { notifications, source: SITE_URL },
          {
            headers: {
              "Cache-Control": "public, max-age=300, stale-while-revalidate=600",
            },
          },
        );
      },
    },
  },
});
