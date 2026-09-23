import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";
import { LAST_UPDATED, SITE_NAME } from "@/lib/site";
import { SITE_URL } from "@/lib/exam-jsonld";

export const Route = createFileRoute("/terms")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: `Terms of Use — ${SITE_NAME}` },
      { name: "description", content: `Terms of use and disclaimer for ${SITE_NAME}.` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/terms` }],
  }),
  component: Terms,
});

function Terms() {
  return (
    <LegalPage title="Terms of Use & Disclaimer" updated={LAST_UPDATED}>
      <p>
        {SITE_NAME} is a free informational tool that tracks entrance exam dates for Indian
        students.
      </p>
      <h2>No official affiliation</h2>
      <p>
        We are not affiliated with NTA, any state CET cell, UPSC or any other exam conducting body.
        Dates marked tentative are estimates. Always confirm details on the official website before
        registering or paying a fee.
      </p>
      <h2>Accuracy</h2>
      <p>
        We try to keep information accurate and up to date, but we do not guarantee completeness or
        accuracy and are not liable for any loss arising from reliance on this site.
      </p>
      <h2>Advertising and links</h2>
      <p>
        The site displays third-party ads and links to external websites. We are not responsible for
        their content.
      </p>
    </LegalPage>
  );
}
