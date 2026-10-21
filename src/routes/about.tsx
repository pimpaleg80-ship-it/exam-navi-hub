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
        content:
          "Who runs EXAM ALERT INDIA, where our exam dates come from, how we verify them, and why the tracker is free for students.",
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
        {SITE_NAME} is a free exam-deadline tracker built by a Physics and Chemistry teacher from
        Maharashtra, operating as H Tech Solutions. It exists for one reason: every year, thousands
        of Indian students miss an entrance exam — not because they weren't capable, but because a
        registration window opened and closed while they were preparing. Class 11–12 students and
        droppers juggle half a dozen portals (NTA, UPSC, state CET cells, IISER, private
        universities), and each one publishes dates in a different format at a different time. We
        pull those deadlines into one place so the student only has to look at one screen.
      </p>

      <h2>What we track</h2>
      <p>
        We follow entrance exams across five groups — Engineering, Medical &amp; Allied Sciences,
        Defence &amp; Armed Forces, Research &amp; Pure Sciences, and State CETs &amp; Regional
        Entrances. For every exam you'll find:
      </p>
      <ul>
        <li>Registration open and close dates, including correction windows where announced</li>
        <li>Admit card release, exam dates, answer keys and result declarations</li>
        <li>Eligibility, application fees, exam pattern and attempts, age limits where applicable</li>
        <li>Live countdowns shown in Indian Standard Time (IST)</li>
        <li>A direct link to the conducting body's official website on every exam page</li>
      </ul>

      <h2>Where our dates come from</h2>
      <p>
        Every date on this site is checked against the conducting body's own notification — an
        official bulletin, information brochure, or press release. Each exam page links to that
        official source so you can verify anything yourself in one click. Dates that the authority
        has published are shown as confirmed; dates we project for a future cycle from the previous
        year's schedule are clearly marked tentative until the official notice replaces them. When
        an authority revises a date, we update the exam page and the change appears on the
        dashboard. We do not guess dates and present them as official — where nothing has been
        announced, we say so.
      </p>

      <h2>What this site is not</h2>
      <p>
        {SITE_NAME} is an independent information platform. It is not a government website,
        department, agency or official examination portal, and it has no affiliation with NTA, UPSC,
        any state CET cell, or any university. We never collect applications or fees — every
        "Apply" link takes you to the conducting body's own portal. Always re-check the latest
        notification on the official website before paying a fee or submitting a form.
      </p>

      <h2>Why it's free</h2>
      <p>
        The site is supported by advertising, so every student can use it at no cost — no sign-up
        wall, no premium tier for the dates that matter. Advertising also pays for the routine
        work of re-verifying dates each cycle against official sources.
      </p>

      <h2>Suggestions and corrections</h2>
      <p>
        If you spot a wrong date or want an exam added, write to us from the contact page. Readers'
        corrections are genuinely the fastest way we fix mistakes, and each one is re-checked
        against the official source before it goes live.
      </p>
    </LegalPage>
  );
}
