import { createFileRoute } from "@tanstack/react-router";
import { ADSENSE_ENABLED, ADSENSE_PUB_ID } from "@/lib/adsense";

// Serves /ads.txt for Google AdSense (Authorized Digital Sellers).
export const Route = createFileRoute("/ads.txt")({
  staticData: { sitemap: false },
  server: {
    handlers: {
      GET: async () => {
        if (!ADSENSE_ENABLED) {
          return new Response("# AdSense not configured\n", {
            status: 404,
            headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
          });
        }
        return new Response(`google.com, ${ADSENSE_PUB_ID}, DIRECT, f08c47fec0942fa0\n`, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=86400",
          },
        });
      },
    },
  },
});
