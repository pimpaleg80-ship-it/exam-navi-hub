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
        content: `Contact ${SITE_NAME} to report a wrong exam date, suggest an exam to add, ask about advertising, or send a correction.`,
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
        Wrong date on an exam page? An entrance exam we don't cover yet? A question about how the
        tracker works? Write to us — corrections from readers are the fastest way this site gets
        better, and every report is re-checked against the official source before it goes live.
      </p>

      {CONTACT_EMAIL && (
        <p>
          Email:{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>
            <strong>{CONTACT_EMAIL}</strong>
          </a>
        </p>
      )}

      <h2>What to include</h2>
      <p>To help us act quickly, mention:</p>
      <ul>
        <li>
          The exam name and the page you were reading (for example, "MHT-CET registration close
          date")
        </li>
        <li>What the page currently says and what you believe the correct date is</li>
        <li>
          A link to the official notification or bulletin where you saw the correct information, if
          you have one
        </li>
      </ul>

      <h2>What we can help with</h2>
      <ul>
        <li>Date corrections and date verification questions</li>
        <li>Requesting an exam or a state CET to be added to the tracker</li>
        <li>Reporting a broken or outdated official link</li>
        <li>Questions about how dates, statuses and countdowns are shown</li>
        <li>Advertising and partnership enquiries</li>
      </ul>

      <h2>What we can't do</h2>
      <p>
        We are not connected to NTA, UPSC, any state CET cell or any university, so we cannot:
      </p>
      <ul>
        <li>Submit, correct or withdraw an application form on your behalf</li>
        <li>Recover an application number, password or admit card</li>
        <li>Refund an application fee or intervene in an authority's decision</li>
      </ul>
      <p>
        For anything about your own application, contact the conducting body's helpdesk listed on
        its official website — every exam page here links to it.
      </p>

      <p>We usually reply within 2–3 working days.</p>
    </LegalPage>
  );
}
