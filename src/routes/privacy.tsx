import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";
import { CONTACT_EMAIL, LAST_UPDATED, SITE_NAME } from "@/lib/site";
import { SITE_URL } from "@/lib/exam-jsonld";

export const Route = createFileRoute("/privacy")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: `Privacy Policy — ${SITE_NAME}` },
      {
        name: "description",
        content: `How ${SITE_NAME} collects, uses and protects your information, including cookies and Google AdSense advertising.`,
      },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/privacy` }],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <LegalPage title="Privacy Policy" updated={LAST_UPDATED}>
      <p>
        This Privacy Policy explains how {SITE_NAME} ("we", "us") handles information when you use
        this website. By using the site you agree to this policy.
      </p>

      <h2>Information we collect</h2>
      <ul>
        <li>
          Preferences you set (followed exams, attempt year, home state, checklists) are stored
          locally in your browser and are not sent to us.
        </li>
        <li>
          If you subscribe to alerts, we store the contact details you provide solely to send those
          alerts.
        </li>
        <li>
          Standard technical data (browser type, device, pages visited, approximate location from
          IP) may be collected by our hosting and analytics providers.
        </li>
      </ul>

      <h2>Cookies and advertising</h2>
      <p>
        We use Google AdSense to show advertisements. Third-party vendors, including Google, use
        cookies to serve ads based on your prior visits to this website or other websites.
      </p>
      <ul>
        <li>
          Google's use of advertising cookies enables it and its partners to serve ads to you based
          on your visits to this site and/or other sites on the Internet.
        </li>
        <li>
          You may opt out of personalised advertising by visiting{" "}
          <a href="https://www.google.com/settings/ads" target="_blank" rel="noreferrer noopener">
            Google Ads Settings
          </a>
          , or opt out of third-party vendor cookies at{" "}
          <a href="https://www.aboutads.info/choices" target="_blank" rel="noreferrer noopener">
            www.aboutads.info
          </a>
          .
        </li>
        <li>
          Learn more in{" "}
          <a
            href="https://policies.google.com/technologies/partner-sites"
            target="_blank"
            rel="noreferrer noopener"
          >
            How Google uses information from sites that use its services
          </a>
          .
        </li>
      </ul>

      <h2>How we use information</h2>
      <ul>
        <li>To operate the exam tracker and send alerts you request.</li>
        <li>To understand usage and improve the site.</li>
        <li>To display advertising that keeps the service free.</li>
      </ul>

      <h2>Children's information</h2>
      <p>
        This site is intended for students preparing for entrance exams. We do not knowingly collect
        personal information from children under 13. If you believe a child has provided such
        information, contact us and we will remove it.
      </p>

      <h2>Your rights</h2>
      <p>
        You can clear locally stored preferences at any time by clearing your browser storage. To
        access or delete any information you have submitted to us,{" "}
        {CONTACT_EMAIL ? (
          <a href={`mailto:${CONTACT_EMAIL}`}>email {CONTACT_EMAIL}</a>
        ) : (
          <a href="/contact">contact us</a>
        )}
        .
      </p>

      <h2>Changes</h2>
      <p>
        We may update this policy from time to time. Changes are posted on this page with a new
        "Last updated" date.
      </p>
    </LegalPage>
  );
}
