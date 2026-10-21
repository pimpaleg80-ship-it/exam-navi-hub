import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";
import { SITE_NAME } from "@/lib/site";
import { SITE_URL } from "@/lib/exam-jsonld";

export const Route = createFileRoute("/faq")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: `FAQ — ${SITE_NAME}` },
      {
        name: "description",
        content:
          "Answers about how EXAM ALERT INDIA works: how often dates update, what tentative and confirmed mean, how reminders and countdowns work, and which years the tracker covers.",
      },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/faq` }],
  }),
  component: Faq,
});

const QA: Array<[string, string]> = [
  [
    "How often are the exam dates updated?",
    "The dashboard re-checks its data feed every few minutes while the page is open, and again whenever you return to the tab. When a conducting body revises or extends a deadline, the change appears on the exam card and the exam's detail page. Even so, always confirm the final deadline on the official portal before you pay a fee.",
  ],
  [
    "What do 'tentative' and 'confirmed' mean?",
    "Confirmed means the date comes from an official notice, bulletin or information brochure published by the conducting body. Tentative means the date is a projection for that attempt year, based on the previous cycle's schedule, because the authority has not yet published its calendar. Tentative dates turn confirmed as each official notice lands.",
  ],
  [
    "Which attempt years can I follow?",
    "Use the year selector on the dashboard to switch your attempt year (for example 2026, 2027, 2028 or 2029). The whole dashboard — dates, countdowns and statuses — re-projects for that cycle. The further ahead the year, the more dates are marked tentative, because authorities publish calendars only about a year in advance.",
  ],
  [
    "What do the status labels mean?",
    "Registration open — you can apply right now. Last 48 hours — the registration window closes within two days, shown in red. Upcoming — registration opens later. Admit card live — hall tickets are being issued. Result out — the result has been declared. Closed — this milestone has passed.",
  ],
  [
    "How does 'Remind me' work?",
    "Tapping Remind me saves that exam to this browser and lists it under My alerts, so your most important deadlines stay pinned at the top of the dashboard. It is stored on your device, so clear the browser's site data if you want to reset your list. Dream exams you mark always stay visible even when other alerts are muted.",
  ],
  [
    "Are the countdowns accurate?",
    "Countdowns count down to the registration close date (or the next milestone) in Indian Standard Time, and they are computed from your device clock each minute. If a deadline is extended by the authority, the countdown moves with the revised date.",
  ],
  [
    "Can I apply for an exam through this site?",
    "No. Every 'Apply on official portal' link takes you directly to the conducting body's own website, which is where applications and fees are handled. We never collect forms, documents or payments, and we never ask for your application details.",
  ],
  [
    "Is this an official government website?",
    "No. EXAM ALERT INDIA is an independent information platform and is not affiliated with NTA, UPSC, any state CET cell or any university. Each exam page links to the conducting body's official website so you can verify every date and fee yourself.",
  ],
  [
    "An exam page shows no exam date. Why?",
    "If the authority hasn't announced the exam date for your selected attempt year, we show 'Not announced' rather than an invented date. Switch to a nearer attempt year to see that cycle's published dates, or check back after the official calendar is released.",
  ],
  [
    "Why does the exam date look different from my coaching institute's sheet?",
    "Many timetables circulate projected dates before the official calendar. When our date is confirmed, it comes from the official notice and we link to it — compare against that source. If you spot a genuine error, report it from the contact page and we'll re-verify against the official bulletin.",
  ],
  [
    "Does it work on my phone?",
    "Yes. The dashboard is designed mobile-first: exam cards resize for small screens, filters collapse neatly, and countdowns stay readable. There is nothing to install — open the site in any browser.",
  ],
  [
    "Is the site free?",
    "Yes, completely. Advertising covers the running costs, so there is no sign-up, no subscription and no paywall on any exam page.",
  ],
];

function Faq() {
  return (
    <LegalPage title="Frequently asked questions">
      <p>
        Short answers to the questions students ask most about {SITE_NAME} — how the dates are
        sourced, what each label means, and how to use the tracker effectively.
      </p>
      {QA.map(([q, a]) => (
        <div key={q} className="not-prose">
          <h2>{q}</h2>
          <p>{a}</p>
        </div>
      ))}
    </LegalPage>
  );
}
