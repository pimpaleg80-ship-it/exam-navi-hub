import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/site";
import { SITE_URL } from "@/lib/exam-jsonld";

export const Route = createFileRoute("/contact")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: `Contact — ${SITE_NAME}` },
      {
        name: "description",
        content: `Contact ${SITE_NAME} to report a wrong date, suggest an exam or ask a question.`,
      },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/contact` }],
  }),
  component: Contact,
});

function Contact() {
  return (
    <LegalPage title="Contact us">
      <p>
        Spotted a wrong date, want an exam added, or have a question? We'd love to hear from you.
      </p>
      {CONTACT_EMAIL && (
        <p>
          Email: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </p>
      )}
      <p>We usually reply within 2–3 working days.</p>
    </LegalPage>
  );
}
