import { useLanguage } from "@/lib/i18n";

export function ExamNotes() {
  const { t } = useLanguage();
  const notes = [
    ["Tentative", "An expected or planning date; confirm it on the official exam portal."],
    ["Confirmed", "A date published in an official notice or bulletin."],
    ["Registration open", "The period when applications can be submitted."],
    ["Registration close", "The final application deadline; late fees may have different dates."],
    ["Official source", "The exam authority website used to verify dates and notices."],
    ["Synced", "The last time this dashboard checked its connected data source."],
  ];

  return (
    <section
      id="notes"
      aria-labelledby="exam-notes-title"
      className="mt-10 rounded-2xl border border-white/15 bg-[#102b4d] p-5 text-white sm:p-6"
    >
      <h2 id="exam-notes-title" className="text-lg font-bold">
        {t("Notes & meanings")}
      </h2>
      <p className="mt-1 text-sm text-[#c5d1e1]">
        {t("Short explanations for the labels used on this dashboard.")}
      </p>
      <dl className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {notes.map(([term, meaning]) => (
          <div key={term} className="rounded-xl border border-white/10 bg-[#081a33]/60 p-4">
            <dt className="text-sm font-semibold">{t(term)}</dt>
            <dd className="mt-1 text-xs leading-5 text-[#c5d1e1]">{t(meaning)}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
