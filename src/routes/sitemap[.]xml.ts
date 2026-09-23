import { createFileRoute } from "@tanstack/react-router";
import { getRouterInstance } from "@tanstack/react-start";
import { EXAMS } from "@/data/exams";
import {
  isSitemapRouteIncluded,
  sitemapPathForLocation,
  sitemapStaticPaths,
  sitemapXML,
  type SitemapEntry,
} from "@/lib/sitemap";

import { SITE_URL } from "@/lib/exam-jsonld";

const BASE_URL = SITE_URL;

export const Route = createFileRoute("/sitemap.xml")({
  staticData: { sitemap: false },
  server: {
    handlers: {
      GET: async () => {
        const router = await getRouterInstance();
        const entries: SitemapEntry[] = sitemapStaticPaths(router).map((path) => ({ path }));

        const examRouteId = "/exam/$slug";
        if (isSitemapRouteIncluded(router.routesById[examRouteId])) {
          for (const exam of EXAMS) {
            const location = router.buildLocation({
              to: "/exam/$slug",
              params: { slug: exam.slug },
              search: () => ({}),
              hash: "",
            });
            const path = sitemapPathForLocation(router, location, examRouteId);
            if (path) entries.push({ path });
          }
        }

        if (entries.length === 0) {
          return new Response(
            'No pages are included in this sitemap. Check route decisions and ancestor exclusions. Setting "exclude-subtree" on the root excludes the entire site.',
            { status: 404, headers: { "Cache-Control": "no-store" } },
          );
        }

        return new Response(sitemapXML(BASE_URL, entries), {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
