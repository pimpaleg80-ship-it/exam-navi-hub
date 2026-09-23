import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";
import { SITE_NAME } from "@/lib/site";
import { SITE_URL } from "@/lib/exam-jsonld";

export const Route = createFileRoute("/about")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: `About — ${SITE_NAME}` },
      {
        name: "description",
        content: `${SITE_NAME} helps PCMB students track every entrance exam deadline in one place.`,
      },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/about` }],
  }),
  component: About,
});

function About() {
  return (
    <LegalPage title={`About ${SITE_NAME}`}>
      <p>
        {SITE_NAME} is built by a Physics and Chemistry teacher from Maharashtra to help Class 11–12
        students and droppers never miss an entrance exam deadline.
      </p>
      <p>
        We track registration windows, correction slots, admit cards, exam days and results for
        engineering, medical, defence, research and state CET exams — including JEE, NEET, NDA,
        IISER and MHT-CET — with live countdowns in IST.
      </p>
      <h2>Why it's free</h2>
      <p>The site is supported by advertising so that every student can use it at no cost.</p>
    </LegalPage>
  );
}
