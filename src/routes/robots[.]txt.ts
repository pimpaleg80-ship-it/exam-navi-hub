import { createFileRoute } from "@tanstack/react-router";

import { SITE_URL } from "@/lib/exam-jsonld";

export const Route = createFileRoute("/robots.txt")({
  staticData: { sitemap: false },
  server: {
    handlers: {
      GET: async () =>
        new Response(
          [
            "User-agent: *",
            "Allow: /",
            "Disallow: /api/",
            "Disallow: /admin",
            "Disallow: /auth",
            "Disallow: /login",
            "Disallow: /signup",
            `Sitemap: ${SITE_URL}/sitemap.xml`,
          ].join("\n") + "\n",
          {
            headers: {
              "Content-Type": "text/plain; charset=utf-8",
              "Cache-Control": "public, max-age=3600",
            },
          },
        ),
    },
  },
});
