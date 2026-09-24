import { createFileRoute, Link } from "@tanstack/react-router";

import { CATEGORY_META, EXAMS, type ExamCategory } from "@/data/exams";
import { GOVERNMENT_CATEGORIES, GOVERNMENT_EXAMS } from "@/data/government-exams";
import { SITE_URL } from "@/lib/exam-jsonld";
import { SITE_NAME } from "@/lib/site";

export const Route = createFileRoute("/exams")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: `Indian Exam Calendar 2027 — ${SITE_NAME}` },
      {
        name: "description",
        content:
          "Browse Indian entrance, government and civil services exams with registration, admit card, result and important-date tracking.",
      },
      { property: "og:title", content: `Indian Exam Calendar 2027 — ${SITE_NAME}` },
      {
        property: "og:description",
        content:
          "Browse verified exam records and official links for Indian entrance and government examinations.",
      },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/exams` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `Indian Exam Calendar 2027 — ${SITE_NAME}`,
          url: `${SITE_URL}/exams`,
          isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: EXAMS.length + GOVERNMENT_EXAMS.length,
            itemListElement: [...EXAMS, ...GOVERNMENT_EXAMS].map((exam, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: "short_code" in exam ? exam.short_code : exam.code,
              url:
                "short_code" in exam
                  ? `${SITE_URL}/exam/${exam.slug}`
                  : `${SITE_URL}/government#${exam.code.toLowerCase()}`,
            })),
          },
        }),
      },
    ],
  }),
  component: ExamDirectory,
});

function ExamDirectory() {
  const categories = Object.keys(CATEGORY_META) as ExamCategory[];

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <Link to="/" className="text-sm font-semibold text-primary">
          ← EXAM ALERT INDIA home
        </Link>
        <header className="mt-8 max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Exam directory
          </p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight">Indian exam calendar 2027</h1>
          <p className="mt-4 text-muted-foreground">
            Explore the existing PCMB entrance-exam records and the separate Government & Civil
            Services dashboard. Dates marked tentative must be checked on the official portal.
          </p>
        </header>

        <section className="mt-10" aria-labelledby="entrance-heading">
          <h2 id="entrance-heading" className="text-2xl font-bold">
            Entrance exams
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const exams = EXAMS.filter((exam) => exam.category === category);
              if (!exams.length) return null;
              return (
                <article key={category} className="rounded-2xl border bg-card p-5 shadow-sm">
                  <h3 className="font-bold">{CATEGORY_META[category].label}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {CATEGORY_META[category].blurb}
                  </p>
                  <ul className="mt-4 space-y-2 text-sm">
                    {exams.map((exam) => (
                      <li key={exam.slug}>
                        <Link
                          className="font-semibold text-primary hover:underline"
                          to="/exam/$slug"
                          params={{ slug: exam.slug }}
                        >
                          {exam.short_code}: dates, eligibility and official link
                        </Link>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-12" aria-labelledby="government-heading">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 id="government-heading" className="text-2xl font-bold">
                Government & Civil Services
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Local dashboard records grouped by recruitment category.
              </p>
            </div>
            <Link to="/government" className="text-sm font-semibold text-primary hover:underline">
              Open government dashboard →
            </Link>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {GOVERNMENT_CATEGORIES.map((category) => {
              const count = GOVERNMENT_EXAMS.filter((exam) => exam.category === category).length;
              return (
                <Link
                  key={category}
                  to="/government"
                  className="rounded-2xl border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-primary"
                >
                  <h3 className="font-bold">{category}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{count} tracked exam records</p>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
