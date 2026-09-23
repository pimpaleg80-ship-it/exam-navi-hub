import type { Exam, ExamDate } from "@/data/exams";

export const SITE_URL = "https://www.examalertindiaonline.com";

const iso = (value?: string) => {
  if (!value) return undefined;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
};

/** One schema.org Event per exam-event card so date details can surface as rich results. */
export function examEventJsonLd(exam: Exam, date: ExamDate, index: number) {
  const start = iso(date.start_datetime);
  if (!start) return undefined;
  const end = iso(date.end_datetime) ?? start;

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    "@id": `${SITE_URL}/exam/${exam.slug}#event-${index}`,
    name: `${exam.short_code} — ${date.label}`,
    description: `${date.label} for ${exam.full_name} conducted by ${exam.conducting_body}.${
      date.is_tentative ? " Date is tentative and subject to official confirmation." : ""
    }`,
    startDate: start,
    endDate: end,
    eventStatus: date.is_tentative
      ? "https://schema.org/EventScheduled"
      : "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
    url: `${SITE_URL}/exam/${exam.slug}`,
    location: {
      "@type": "VirtualLocation",
      url: exam.official_website,
    },
    organizer: {
      "@type": "Organization",
      name: exam.conducting_body,
      url: exam.official_website,
    },
    about: {
      "@type": "EducationalOccupationalProgram",
      name: exam.full_name,
      provider: { "@type": "Organization", name: exam.conducting_body },
    },
  };
}

/** Full structured-data payload for one exam detail page. */
export function examDetailJsonLd(exam: Exam) {
  const events = (exam.dates ?? [])
    .map((date, i) => examEventJsonLd(exam, date, i))
    .filter((x): x is NonNullable<typeof x> => Boolean(x));

  const page = {
    "@context": "https://schema.org",
    "@type": "EducationalOccupationalProgram",
    name: exam.full_name,
    alternateName: exam.short_code,
    url: `${SITE_URL}/exam/${exam.slug}`,
    provider: {
      "@type": "Organization",
      name: exam.conducting_body,
      url: exam.official_website,
    },
    educationalProgramMode: "full-time",
    programPrerequisites: exam.eligibility_summary,
    occupationalCategory: exam.streams?.join(", "),
    offers: (exam.fees ?? []).map((fee) => ({
      "@type": "Offer",
      name: fee.category_label,
      price: fee.amount,
      priceCurrency: "INR",
      url: exam.application_url,
    })),
  };

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "All exams", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: exam.short_code,
        item: `${SITE_URL}/exam/${exam.slug}`,
      },
    ],
  };

  return { page, breadcrumbs, events };
}

/** ItemList of exam cards shown on the dashboard. */
export function examListJsonLd(exams: Exam[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Indian PCMB entrance exam calendar",
    numberOfItems: exams.length,
    itemListElement: exams.map((exam, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `${exam.short_code} — ${exam.full_name}`,
      url: `${SITE_URL}/exam/${exam.slug}`,
    })),
  };
}
