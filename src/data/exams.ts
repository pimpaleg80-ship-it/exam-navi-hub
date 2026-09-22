export type ExamCategory = "engineering" | "medical" | "defense" | "research" | "state-cet";

export type Stream = "PCM" | "PCB" | "PCMB";

export type EventType =
  | "notification_released"
  | "registration_open"
  | "registration_close"
  | "late_fee_close"
  | "correction_window"
  | "city_slip"
  | "admit_card"
  | "exam_date"
  | "answer_key"
  | "result"
  | "counseling";

export type ExamDate = {
  event_type: EventType;
  label: string;
  start_datetime: string;
  end_datetime?: string;
  is_tentative?: boolean;
  is_extended?: boolean;
};

export type ExamFee = { category_label: string; amount: number };

export type Exam = {
  slug: string;
  full_name: string;
  short_code: string;
  category: ExamCategory;
  streams: Stream[];
  conducting_body: string;
  official_website: string;
  application_url: string;
  state?: string;
  eligibility_summary: string;
  min_percentage: string;
  age_limit: string;
  pattern: string;
  fees: ExamFee[];
  dates: ExamDate[];
};

export const CATEGORY_META: Record<ExamCategory, { label: string; blurb: string }> = {
  engineering: { label: "Engineering (PCM)", blurb: "B.E. / B.Tech entrances" },
  medical: { label: "Medical & Allied (PCB)", blurb: "MBBS, BDS, Nursing, Agri" },
  defense: { label: "Defense & Armed Forces", blurb: "NDA, TES, AFCAT" },
  research: { label: "Research & Pure Sciences", blurb: "IISER, NISER, ISI, CMI" },
  "state-cet": { label: "State CETs & Regional", blurb: "Domicile-quota entrances" },
};

export const STATES = [
  "All India",
  "Maharashtra",
  "Karnataka",
  "West Bengal",
  "Telangana",
  "Andhra Pradesh",
  "Kerala",
  "Gujarat",
  "Odisha",
  "Bihar",
  "Delhi",
  "Tamil Nadu",
  "Uttar Pradesh",
  "Rajasthan",
];

// Dates are cycle-2027 planning values; admins flip `is_tentative` once the
// official bulletin lands.
const d = (y: number, m: number, day: number, h = 10, min = 0) =>
  new Date(Date.UTC(y, m - 1, day, h - 5, min - 30)).toISOString();

export const EXAMS: Exam[] = [
  {
    slug: "jee-main",
    full_name: "Joint Entrance Examination (Main)",
    short_code: "JEE Main",
    category: "engineering",
    streams: ["PCM", "PCMB"],
    conducting_body: "National Testing Agency (NTA)",
    official_website: "https://jeemain.nta.nic.in",
    application_url: "https://jeemain.nta.nic.in",
    eligibility_summary:
      "Class 12 pass/appearing with Physics, Chemistry and Mathematics as compulsory subjects; 2025/2026/2027 board batches eligible.",
    min_percentage: "75% in 12th (65% SC/ST) for NIT/IIIT/GFTI admission",
    age_limit: "No upper age limit",
    pattern: "CBT · 300 marks · 3 hrs · +4 / -1 negative marking · 2 sessions",
    fees: [
      { category_label: "General (Male)", amount: 1000 },
      { category_label: "General (Female)", amount: 800 },
      { category_label: "OBC-NCL / EWS", amount: 900 },
      { category_label: "SC / ST / PwD", amount: 500 },
    ],
    dates: [
      {
        event_type: "notification_released",
        label: "Information Bulletin out",
        start_datetime: d(2026, 10, 28),
      },
      {
        event_type: "registration_open",
        label: "Session 1 registration opens",
        start_datetime: d(2026, 10, 28),
      },
      {
        event_type: "registration_close",
        label: "Session 1 registration closes",
        start_datetime: d(2026, 11, 25, 23, 50),
      },
      {
        event_type: "correction_window",
        label: "Correction window",
        start_datetime: d(2026, 11, 28),
        end_datetime: d(2026, 11, 30, 23, 50),
      },
      {
        event_type: "city_slip",
        label: "City intimation slip",
        start_datetime: d(2026, 12, 20),
        is_tentative: true,
      },
      {
        event_type: "admit_card",
        label: "Admit card release",
        start_datetime: d(2027, 1, 15),
        is_tentative: true,
      },
      {
        event_type: "exam_date",
        label: "Session 1 exam window",
        start_datetime: d(2027, 1, 22),
        end_datetime: d(2027, 1, 30),
      },
      {
        event_type: "answer_key",
        label: "Provisional answer key & challenge",
        start_datetime: d(2027, 2, 4),
        end_datetime: d(2027, 2, 6),
        is_tentative: true,
      },
      {
        event_type: "result",
        label: "Session 1 result",
        start_datetime: d(2027, 2, 12),
        is_tentative: true,
      },
    ],
  },
  {
    slug: "jee-advanced",
    full_name: "Joint Entrance Examination (Advanced)",
    short_code: "JEE Advanced",
    category: "engineering",
    streams: ["PCM", "PCMB"],
    conducting_body: "IIT (rotating zonal IIT)",
    official_website: "https://jeeadv.ac.in",
    application_url: "https://jeeadv.ac.in",
    eligibility_summary:
      "Top 2,50,000 JEE Main qualifiers; maximum two attempts in consecutive years.",
    min_percentage: "75% in 12th (65% SC/ST/PwD) or top 20 percentile",
    age_limit: "Born on or after 1 Oct 2002 (relaxations apply)",
    pattern: "CBT · Paper 1 + Paper 2 · 3 hrs each · variable negative marking",
    fees: [
      { category_label: "General / OBC (Male)", amount: 3200 },
      { category_label: "Female (all categories)", amount: 1600 },
      { category_label: "SC / ST / PwD", amount: 1600 },
    ],
    dates: [
      {
        event_type: "registration_open",
        label: "Registration opens",
        start_datetime: d(2027, 4, 23),
      },
      {
        event_type: "registration_close",
        label: "Registration closes",
        start_datetime: d(2027, 5, 2, 17, 0),
      },
      {
        event_type: "admit_card",
        label: "Admit card release",
        start_datetime: d(2027, 5, 11),
        is_tentative: true,
      },
      { event_type: "exam_date", label: "Exam day", start_datetime: d(2027, 5, 18, 9, 0) },
      {
        event_type: "result",
        label: "Result declaration",
        start_datetime: d(2027, 6, 8),
        is_tentative: true,
      },
    ],
  },
  {
    slug: "bitsat",
    full_name: "BITS Admission Test",
    short_code: "BITSAT",
    category: "engineering",
    streams: ["PCM", "PCMB"],
    conducting_body: "BITS Pilani",
    official_website: "https://www.bitsadmission.com",
    application_url: "https://www.bitsadmission.com",
    eligibility_summary: "Min 75% aggregate in PCM with at least 60% in each subject.",
    min_percentage: "75% aggregate in PCM",
    age_limit: "No upper age limit",
    pattern: "CBT · 130 questions · 3 hrs · +3 / -1 · two sessions",
    fees: [
      { category_label: "Male (1 session)", amount: 3500 },
      { category_label: "Female (1 session)", amount: 3000 },
      { category_label: "Both sessions", amount: 5500 },
    ],
    dates: [
      {
        event_type: "registration_open",
        label: "Registration opens",
        start_datetime: d(2027, 1, 15),
      },
      {
        event_type: "registration_close",
        label: "Registration closes",
        start_datetime: d(2027, 3, 20, 23, 50),
      },
      {
        event_type: "admit_card",
        label: "Hall ticket release",
        start_datetime: d(2027, 5, 5),
        is_tentative: true,
      },
      {
        event_type: "exam_date",
        label: "Session 1 exam window",
        start_datetime: d(2027, 5, 21),
        end_datetime: d(2027, 5, 26),
      },
    ],
  },
  {
    slug: "viteee",
    full_name: "VIT Engineering Entrance Examination",
    short_code: "VITEEE",
    category: "engineering",
    streams: ["PCM", "PCMB"],
    conducting_body: "Vellore Institute of Technology",
    official_website: "https://viteee.vit.ac.in",
    application_url: "https://viteee.vit.ac.in",
    eligibility_summary: "60% aggregate in PCM/PCB in 12th (50% for reserved categories of TN).",
    min_percentage: "60% aggregate",
    age_limit: "Born on or after 1 July 2005",
    pattern: "CBT · 125 questions · 2.5 hrs · no negative marking",
    fees: [{ category_label: "All categories", amount: 1350 }],
    dates: [
      {
        event_type: "registration_open",
        label: "Application opens",
        start_datetime: d(2026, 11, 5),
      },
      {
        event_type: "registration_close",
        label: "Application closes",
        start_datetime: d(2027, 3, 31, 23, 50),
      },
      {
        event_type: "exam_date",
        label: "Exam window",
        start_datetime: d(2027, 4, 19),
        end_datetime: d(2027, 4, 27),
        is_tentative: true,
      },
    ],
  },
  {
    slug: "srmjeee",
    full_name: "SRM Joint Engineering Entrance Examination",
    short_code: "SRMJEEE",
    category: "engineering",
    streams: ["PCM", "PCMB"],
    conducting_body: "SRM Institute of Science and Technology",
    official_website: "https://www.srmist.edu.in",
    application_url: "https://applications.srmist.edu.in",
    eligibility_summary: "60% aggregate in PCM; three phases per cycle.",
    min_percentage: "60% aggregate in PCM",
    age_limit: "No upper age limit",
    pattern: "Remote-proctored CBT · 125 questions · 2.5 hrs · no negative marking",
    fees: [{ category_label: "All categories", amount: 1400 }],
    dates: [
      {
        event_type: "registration_open",
        label: "Phase 1 registration opens",
        start_datetime: d(2026, 11, 1),
      },
      {
        event_type: "registration_close",
        label: "Phase 1 registration closes",
        start_datetime: d(2027, 3, 30, 23, 50),
      },
      {
        event_type: "exam_date",
        label: "Phase 1 exam",
        start_datetime: d(2027, 4, 10),
        end_datetime: d(2027, 4, 12),
        is_tentative: true,
      },
    ],
  },
  {
    slug: "met",
    full_name: "Manipal Entrance Test",
    short_code: "MET",
    category: "engineering",
    streams: ["PCM", "PCMB"],
    conducting_body: "Manipal Academy of Higher Education",
    official_website: "https://manipal.edu",
    application_url: "https://manipal.edu/mu/admission.html",
    eligibility_summary: "50% aggregate in PCM / PCB with English.",
    min_percentage: "50% aggregate",
    age_limit: "No upper age limit",
    pattern: "Online proctored · 120 questions · 2 hrs · no negative marking",
    fees: [{ category_label: "All categories", amount: 600 }],
    dates: [
      {
        event_type: "registration_open",
        label: "Application opens",
        start_datetime: d(2026, 10, 20),
      },
      {
        event_type: "registration_close",
        label: "Phase 1 closes",
        start_datetime: d(2027, 3, 15, 23, 50),
      },
      {
        event_type: "exam_date",
        label: "Phase 1 exam",
        start_datetime: d(2027, 4, 5),
        is_tentative: true,
      },
    ],
  },
  {
    slug: "aeee",
    full_name: "Amrita Entrance Examination – Engineering",
    short_code: "AEEE",
    category: "engineering",
    streams: ["PCM", "PCMB"],
    conducting_body: "Amrita Vishwa Vidyapeetham",
    official_website: "https://www.amrita.edu",
    application_url: "https://amrita.edu/btech",
    eligibility_summary: "60% in PCM aggregate and 55% in each subject.",
    min_percentage: "60% aggregate in PCM",
    age_limit: "Born on or after 1 July 2005",
    pattern: "CBT / remote-proctored · 100 questions · 2.5 hrs · +3 / -1",
    fees: [{ category_label: "All categories", amount: 1200 }],
    dates: [
      {
        event_type: "registration_open",
        label: "Application opens",
        start_datetime: d(2026, 10, 15),
      },
      {
        event_type: "registration_close",
        label: "Phase 1 closes",
        start_datetime: d(2027, 2, 28, 23, 50),
      },
      {
        event_type: "exam_date",
        label: "Phase 1 exam",
        start_datetime: d(2027, 3, 20),
        is_tentative: true,
      },
    ],
  },
  {
    slug: "neet-ug",
    full_name: "National Eligibility cum Entrance Test (UG)",
    short_code: "NEET-UG",
    category: "medical",
    streams: ["PCB", "PCMB"],
    conducting_body: "National Testing Agency (NTA)",
    official_website: "https://neet.nta.nic.in",
    application_url: "https://neet.nta.nic.in",
    eligibility_summary:
      "Class 12 with Physics, Chemistry, Biology/Biotechnology and English; single mandatory gateway for MBBS/BDS/AYUSH/Veterinary.",
    min_percentage: "50% in PCB (40% SC/ST/OBC, 45% PwD)",
    age_limit: "Minimum 17 years as on 31 December of admission year",
    pattern: "Pen & paper OMR · 180 questions · 720 marks · 3 hrs 20 min · +4 / -1",
    fees: [
      { category_label: "General", amount: 1700 },
      { category_label: "General-EWS / OBC-NCL", amount: 1600 },
      { category_label: "SC / ST / PwD / Third gender", amount: 1000 },
    ],
    dates: [
      {
        event_type: "notification_released",
        label: "Information Bulletin out",
        start_datetime: d(2027, 2, 5),
      },
      {
        event_type: "registration_open",
        label: "Registration opens",
        start_datetime: d(2027, 2, 5),
      },
      {
        event_type: "registration_close",
        label: "Registration closes",
        start_datetime: d(2027, 3, 7, 23, 50),
      },
      {
        event_type: "correction_window",
        label: "Correction window",
        start_datetime: d(2027, 3, 10),
        end_datetime: d(2027, 3, 12, 23, 50),
      },
      {
        event_type: "city_slip",
        label: "City intimation slip",
        start_datetime: d(2027, 4, 20),
        is_tentative: true,
      },
      {
        event_type: "admit_card",
        label: "Admit card release",
        start_datetime: d(2027, 4, 30),
        is_tentative: true,
      },
      { event_type: "exam_date", label: "Exam day", start_datetime: d(2027, 5, 2, 14, 0) },
      {
        event_type: "answer_key",
        label: "Provisional answer key & challenge",
        start_datetime: d(2027, 5, 28),
        end_datetime: d(2027, 5, 30),
        is_tentative: true,
      },
      {
        event_type: "result",
        label: "Result declaration",
        start_datetime: d(2027, 6, 14),
        is_tentative: true,
      },
      {
        event_type: "counseling",
        label: "MCC counseling registration",
        start_datetime: d(2027, 7, 15),
        is_tentative: true,
      },
    ],
  },
  {
    slug: "icar-aieea-ug",
    full_name: "ICAR All India Entrance Examination for Admission (UG)",
    short_code: "ICAR AIEEA-UG",
    category: "medical",
    streams: ["PCB", "PCMB"],
    conducting_body: "National Testing Agency for ICAR",
    official_website: "https://icar.nta.ac.in",
    application_url: "https://icar.nta.ac.in",
    eligibility_summary:
      "Class 12 with PCB / PCM / Agriculture for UG agriculture and allied degrees.",
    min_percentage: "50% aggregate (40% for reserved categories)",
    age_limit: "Minimum 16 years as on 31 August",
    pattern: "CBT · 150 questions · 2.5 hrs · +4 / -1",
    fees: [
      { category_label: "General", amount: 950 },
      { category_label: "OBC / EWS", amount: 750 },
      { category_label: "SC / ST / PwD", amount: 475 },
    ],
    dates: [
      {
        event_type: "registration_open",
        label: "Registration opens",
        start_datetime: d(2027, 3, 10),
      },
      {
        event_type: "registration_close",
        label: "Registration closes",
        start_datetime: d(2027, 4, 12, 23, 50),
      },
      {
        event_type: "exam_date",
        label: "Exam day",
        start_datetime: d(2027, 6, 5),
        is_tentative: true,
      },
    ],
  },
  {
    slug: "aiims-bsc-nursing",
    full_name: "AIIMS B.Sc. Nursing (Hons.) & Paramedical Entrance",
    short_code: "AIIMS Nursing",
    category: "medical",
    streams: ["PCB", "PCMB"],
    conducting_body: "AIIMS New Delhi",
    official_website: "https://www.aiimsexams.ac.in",
    application_url: "https://www.aiimsexams.ac.in",
    eligibility_summary: "Class 12 with PCB and English; female/male as per campus norms.",
    min_percentage: "55% aggregate in PCBE",
    age_limit: "17–25 years as on 31 December",
    pattern: "CBT · 100 questions · 2 hrs · +1 / -1/3",
    fees: [
      { category_label: "General / OBC", amount: 2000 },
      { category_label: "SC / ST", amount: 1600 },
    ],
    dates: [
      {
        event_type: "registration_open",
        label: "Registration opens",
        start_datetime: d(2027, 3, 20),
      },
      {
        event_type: "registration_close",
        label: "Registration closes",
        start_datetime: d(2027, 4, 20, 17, 0),
      },
      {
        event_type: "admit_card",
        label: "Admit card release",
        start_datetime: d(2027, 5, 25),
        is_tentative: true,
      },
      {
        event_type: "exam_date",
        label: "Exam day",
        start_datetime: d(2027, 6, 8),
        is_tentative: true,
      },
    ],
  },
  {
    slug: "nda-na",
    full_name: "National Defence Academy & Naval Academy Examination (I & II)",
    short_code: "NDA & NA",
    category: "defense",
    streams: ["PCM", "PCB", "PCMB"],
    conducting_body: "Union Public Service Commission (UPSC)",
    official_website: "https://upsc.gov.in",
    application_url: "https://upsconline.nic.in",
    eligibility_summary:
      "Unmarried candidates; Physics & Mathematics compulsory for Air Force, Navy and 10+2 Cadet Entry.",
    min_percentage: "Class 12 pass (PCM required for Air Force / Navy)",
    age_limit: "16.5 – 19.5 years at course commencement",
    pattern:
      "OMR · Maths 300 + GAT 600 marks · +ve/-ve marking · followed by SSB interview (900 marks)",
    fees: [
      { category_label: "General / OBC", amount: 100 },
      { category_label: "SC / ST / Sons of JCOs", amount: 0 },
    ],
    dates: [
      {
        event_type: "notification_released",
        label: "NDA-I notification",
        start_datetime: d(2026, 12, 10),
      },
      {
        event_type: "registration_open",
        label: "NDA-I registration opens",
        start_datetime: d(2026, 12, 10),
      },
      {
        event_type: "registration_close",
        label: "NDA-I registration closes",
        start_datetime: d(2026, 12, 30, 18, 0),
      },
      {
        event_type: "admit_card",
        label: "e-Admit card",
        start_datetime: d(2027, 3, 25),
        is_tentative: true,
      },
      {
        event_type: "exam_date",
        label: "NDA-I written exam",
        start_datetime: d(2027, 4, 11, 10, 0),
      },
      {
        event_type: "registration_open",
        label: "NDA-II registration opens",
        start_datetime: d(2027, 5, 19),
      },
      {
        event_type: "registration_close",
        label: "NDA-II registration closes",
        start_datetime: d(2027, 6, 8, 18, 0),
      },
    ],
  },
  {
    slug: "army-tes",
    full_name: "Indian Army Technical Entry Scheme (10+2)",
    short_code: "Army TES",
    category: "defense",
    streams: ["PCM", "PCMB"],
    conducting_body: "Indian Army (Directorate General of Recruiting)",
    official_website: "https://joinindianarmy.nic.in",
    application_url: "https://joinindianarmy.nic.in",
    eligibility_summary: "Unmarried male candidates with PCM and valid JEE Main score.",
    min_percentage: "60% aggregate in PCM",
    age_limit: "16.5 – 19.5 years",
    pattern: "Shortlisting on JEE Main percentile → 5-day SSB interview + medical",
    fees: [{ category_label: "All categories", amount: 0 }],
    dates: [
      {
        event_type: "registration_open",
        label: "Online application opens",
        start_datetime: d(2027, 5, 15),
      },
      {
        event_type: "registration_close",
        label: "Online application closes",
        start_datetime: d(2027, 6, 13, 23, 50),
      },
      {
        event_type: "result",
        label: "SSB shortlist published",
        start_datetime: d(2027, 7, 20),
        is_tentative: true,
      },
    ],
  },
  {
    slug: "afcat",
    full_name: "Air Force Common Admission Test (incl. NCC Special Entry)",
    short_code: "AFCAT",
    category: "defense",
    streams: ["PCM", "PCMB"],
    conducting_body: "Indian Air Force",
    official_website: "https://afcat.cdac.in",
    application_url: "https://afcat.cdac.in",
    eligibility_summary:
      "Graduates with Physics & Maths at 10+2 for Flying branch; post-12th aspirants track this for NCC/Flying pathways.",
    min_percentage: "60% in graduation; 50% each in Physics & Maths at 12th",
    age_limit: "20 – 24 years for Flying branch",
    pattern: "CBT · 100 questions · 2 hrs · +3 / -1 · EKT for technical branch",
    fees: [{ category_label: "All categories (AFCAT entry)", amount: 550 }],
    dates: [
      {
        event_type: "registration_open",
        label: "AFCAT 01 registration opens",
        start_datetime: d(2026, 12, 1),
      },
      {
        event_type: "registration_close",
        label: "AFCAT 01 registration closes",
        start_datetime: d(2026, 12, 30, 23, 30),
      },
      {
        event_type: "admit_card",
        label: "Admit card release",
        start_datetime: d(2027, 1, 25),
        is_tentative: true,
      },
      {
        event_type: "exam_date",
        label: "AFCAT 01 exam",
        start_datetime: d(2027, 2, 12),
        end_datetime: d(2027, 2, 14),
      },
    ],
  },
  {
    slug: "iiser-iat",
    full_name: "IISER Aptitude Test",
    short_code: "IAT",
    category: "research",
    streams: ["PCM", "PCB", "PCMB"],
    conducting_body: "Indian Institutes of Science Education and Research",
    official_website: "https://www.iiseradmission.in",
    application_url: "https://www.iiseradmission.in",
    eligibility_summary:
      "Class 12 in science stream in the last two years; single national aptitude test for all IISERs.",
    min_percentage: "60% aggregate (55% SC/ST/PwD)",
    age_limit: "No upper age limit",
    pattern: "CBT · 60 questions (PCMB) · 3 hrs · +4 / -1",
    fees: [
      { category_label: "General / OBC / EWS", amount: 2000 },
      { category_label: "SC / ST / PwD", amount: 1000 },
    ],
    dates: [
      {
        event_type: "registration_open",
        label: "Application opens",
        start_datetime: d(2027, 4, 1),
      },
      {
        event_type: "registration_close",
        label: "Application closes",
        start_datetime: d(2027, 5, 10, 23, 50),
      },
      {
        event_type: "admit_card",
        label: "Admit card release",
        start_datetime: d(2027, 5, 22),
        is_tentative: true,
      },
      {
        event_type: "exam_date",
        label: "Exam day",
        start_datetime: d(2027, 5, 31, 9, 0),
        is_tentative: true,
      },
    ],
  },
  {
    slug: "nest",
    full_name: "National Entrance Screening Test (NISER & UM-DAE CEBS)",
    short_code: "NEST",
    category: "research",
    streams: ["PCM", "PCB", "PCMB"],
    conducting_body: "NISER Bhubaneswar & UM-DAE CEBS Mumbai",
    official_website: "https://www.nestexam.in",
    application_url: "https://www.nestexam.in",
    eligibility_summary: "Class 12 science pass in the last two years; integrated M.Sc. admission.",
    min_percentage: "60% aggregate (55% SC/ST/PwD)",
    age_limit: "No upper age limit",
    pattern: "CBT · 4 sections (Bio, Chem, Maths, Physics) · 3.5 hrs · sectional best-of-3",
    fees: [
      { category_label: "General / OBC (Male)", amount: 1400 },
      { category_label: "Female / SC / ST / PwD", amount: 700 },
    ],
    dates: [
      {
        event_type: "registration_open",
        label: "Application opens",
        start_datetime: d(2027, 2, 20),
      },
      {
        event_type: "registration_close",
        label: "Application closes",
        start_datetime: d(2027, 5, 5, 23, 50),
      },
      {
        event_type: "exam_date",
        label: "Exam day",
        start_datetime: d(2027, 6, 21, 9, 0),
        is_tentative: true,
      },
    ],
  },
  {
    slug: "isi-admission-test",
    full_name: "Indian Statistical Institute Admission Test (B.Stat / B.Math)",
    short_code: "ISI Admission Test",
    category: "research",
    streams: ["PCM", "PCMB"],
    conducting_body: "Indian Statistical Institute",
    official_website: "https://www.isical.ac.in",
    application_url: "https://www.isical.ac.in/admissions",
    eligibility_summary:
      "Class 12 with Mathematics and English; B.Stat (Hons) and B.Math (Hons) entry.",
    min_percentage: "Pass in 12th with Mathematics",
    age_limit: "No upper age limit",
    pattern: "Objective (UGA) + Subjective (UGB) papers · 2 hrs each · interview for shortlisted",
    fees: [
      { category_label: "General / OBC", amount: 1500 },
      { category_label: "SC / ST / PwD", amount: 750 },
    ],
    dates: [
      {
        event_type: "registration_open",
        label: "Application opens",
        start_datetime: d(2027, 2, 1),
      },
      {
        event_type: "registration_close",
        label: "Application closes",
        start_datetime: d(2027, 3, 5, 23, 50),
      },
      {
        event_type: "exam_date",
        label: "Written test",
        start_datetime: d(2027, 5, 9, 10, 0),
        is_tentative: true,
      },
    ],
  },
  {
    slug: "cmi-entrance",
    full_name: "Chennai Mathematical Institute Entrance Examination",
    short_code: "CMI Entrance",
    category: "research",
    streams: ["PCM", "PCMB"],
    conducting_body: "Chennai Mathematical Institute",
    official_website: "https://www.cmi.ac.in",
    application_url: "https://www.cmi.ac.in/admissions",
    eligibility_summary: "Class 12 with Mathematics; B.Sc. (Hons) Maths & CS / Maths & Physics.",
    min_percentage: "Pass in 12th with Mathematics",
    age_limit: "No upper age limit",
    pattern: "Part A objective + Part B subjective · 3 hrs · no negative marking",
    fees: [
      { category_label: "General", amount: 1000 },
      { category_label: "SC / ST / PwD", amount: 500 },
    ],
    dates: [
      {
        event_type: "registration_open",
        label: "Application opens",
        start_datetime: d(2027, 3, 1),
      },
      {
        event_type: "registration_close",
        label: "Application closes",
        start_datetime: d(2027, 4, 15, 23, 50),
      },
      {
        event_type: "exam_date",
        label: "Entrance exam",
        start_datetime: d(2027, 5, 16, 13, 0),
        is_tentative: true,
      },
    ],
  },
  {
    slug: "mht-cet",
    full_name: "Maharashtra Common Entrance Test",
    short_code: "MHT CET",
    category: "state-cet",
    state: "Maharashtra",
    streams: ["PCM", "PCB", "PCMB"],
    conducting_body: "State CET Cell, Maharashtra",
    official_website: "https://cetcell.mahacet.org",
    application_url: "https://cetcell.mahacet.org",
    eligibility_summary:
      "Maharashtra domicile preferred; PCM group for engineering, PCB group for pharmacy/agri.",
    min_percentage: "45% in PCM/PCB (40% reserved)",
    age_limit: "No upper age limit",
    pattern: "CBT · 150 marks · 3 hrs · no negative marking · PCM and PCB groups",
    fees: [
      { category_label: "General (Maharashtra)", amount: 1000 },
      { category_label: "Reserved / Female / PwD", amount: 800 },
    ],
    dates: [
      {
        event_type: "registration_open",
        label: "Registration opens",
        start_datetime: d(2026, 12, 26),
      },
      {
        event_type: "registration_close",
        label: "Registration closes",
        start_datetime: d(2027, 2, 15, 23, 50),
      },
      {
        event_type: "late_fee_close",
        label: "Late fee window closes",
        start_datetime: d(2027, 2, 22, 23, 50),
      },
      {
        event_type: "admit_card",
        label: "Hall ticket release",
        start_datetime: d(2027, 4, 5),
        is_tentative: true,
      },
      {
        event_type: "exam_date",
        label: "PCM group exam window",
        start_datetime: d(2027, 4, 16),
        end_datetime: d(2027, 4, 25),
      },
    ],
  },
  {
    slug: "kcet",
    full_name: "Karnataka Common Entrance Test",
    short_code: "KCET",
    category: "state-cet",
    state: "Karnataka",
    streams: ["PCM", "PCB", "PCMB"],
    conducting_body: "Karnataka Examinations Authority (KEA)",
    official_website: "https://cetonline.karnataka.gov.in",
    application_url: "https://cetonline.karnataka.gov.in/kea",
    eligibility_summary: "Karnataka domicile with 7-year study requirement for state quota seats.",
    min_percentage: "45% in PCM (40% reserved)",
    age_limit: "No upper age limit",
    pattern: "OMR · Physics, Chemistry, Maths/Biology · 60 marks each · no negative marking",
    fees: [
      { category_label: "General (Karnataka)", amount: 500 },
      { category_label: "SC / ST / Cat-1", amount: 250 },
    ],
    dates: [
      {
        event_type: "registration_open",
        label: "Application opens",
        start_datetime: d(2027, 1, 20),
      },
      {
        event_type: "registration_close",
        label: "Application closes",
        start_datetime: d(2027, 2, 20, 23, 50),
      },
      {
        event_type: "admit_card",
        label: "Admit card release",
        start_datetime: d(2027, 4, 1),
        is_tentative: true,
      },
      {
        event_type: "exam_date",
        label: "Exam days",
        start_datetime: d(2027, 4, 15),
        end_datetime: d(2027, 4, 16),
      },
    ],
  },
  {
    slug: "comedk-uget",
    full_name: "COMEDK Undergraduate Entrance Test",
    short_code: "COMEDK UGET",
    category: "state-cet",
    state: "Karnataka",
    streams: ["PCM", "PCMB"],
    conducting_body: "Consortium of Medical, Engineering and Dental Colleges of Karnataka",
    official_website: "https://www.comedk.org",
    application_url: "https://www.comedk.org",
    eligibility_summary: "Open to all India candidates; PCM with English compulsory.",
    min_percentage: "45% in PCM (40% reserved, Karnataka)",
    age_limit: "No upper age limit",
    pattern: "CBT · 180 questions · 3 hrs · no negative marking",
    fees: [{ category_label: "All categories", amount: 1800 }],
    dates: [
      {
        event_type: "registration_open",
        label: "Application opens",
        start_datetime: d(2027, 1, 10),
      },
      {
        event_type: "registration_close",
        label: "Application closes",
        start_datetime: d(2027, 4, 5, 23, 50),
      },
      {
        event_type: "exam_date",
        label: "Exam day",
        start_datetime: d(2027, 5, 9, 9, 0),
        is_tentative: true,
      },
    ],
  },
  {
    slug: "wbjee",
    full_name: "West Bengal Joint Entrance Examination",
    short_code: "WBJEE",
    category: "state-cet",
    state: "West Bengal",
    streams: ["PCM", "PCMB"],
    conducting_body: "WBJEE Board",
    official_website: "https://wbjeeb.nic.in",
    application_url: "https://wbjeeb.nic.in",
    eligibility_summary:
      "Class 12 with Physics & Mathematics plus one of Chemistry/Biology/Biotech/CS.",
    min_percentage: "45% aggregate in PCM (40% reserved)",
    age_limit: "Minimum 17 years as on 31 December",
    pattern: "OMR · Paper 1 Maths, Paper 2 Physics & Chemistry · variable marking",
    fees: [
      { category_label: "General (Male)", amount: 500 },
      { category_label: "Female / SC / ST / PwD", amount: 400 },
    ],
    dates: [
      {
        event_type: "registration_open",
        label: "Application opens",
        start_datetime: d(2026, 12, 20),
      },
      {
        event_type: "registration_close",
        label: "Application closes",
        start_datetime: d(2027, 1, 20, 23, 50),
      },
      {
        event_type: "correction_window",
        label: "Correction window",
        start_datetime: d(2027, 1, 23),
        end_datetime: d(2027, 1, 26),
      },
      {
        event_type: "exam_date",
        label: "Exam day",
        start_datetime: d(2027, 4, 25, 11, 0),
        is_tentative: true,
      },
    ],
  },
  {
    slug: "ts-eapcet",
    full_name: "Telangana State Engineering, Agriculture & Pharmacy Common Entrance Test",
    short_code: "TG EAPCET",
    category: "state-cet",
    state: "Telangana",
    streams: ["PCM", "PCB", "PCMB"],
    conducting_body: "JNTU Hyderabad on behalf of TGCHE",
    official_website: "https://eapcet.tgche.ac.in",
    application_url: "https://eapcet.tgche.ac.in",
    eligibility_summary: "Telangana/AP domicile; separate engineering and agriculture streams.",
    min_percentage: "45% in group subjects (40% reserved)",
    age_limit: "16 years as on 31 December",
    pattern: "CBT · 160 questions · 3 hrs · no negative marking",
    fees: [
      { category_label: "General (one stream)", amount: 900 },
      { category_label: "SC / ST", amount: 500 },
    ],
    dates: [
      {
        event_type: "registration_open",
        label: "Application opens",
        start_datetime: d(2027, 2, 1),
      },
      {
        event_type: "registration_close",
        label: "Application closes",
        start_datetime: d(2027, 3, 20, 23, 50),
      },
      {
        event_type: "late_fee_close",
        label: "Late fee window closes",
        start_datetime: d(2027, 4, 5, 23, 50),
      },
      {
        event_type: "exam_date",
        label: "Engineering stream exam",
        start_datetime: d(2027, 5, 4),
        end_datetime: d(2027, 5, 8),
        is_tentative: true,
      },
    ],
  },
  {
    slug: "ap-eapcet",
    full_name: "Andhra Pradesh Engineering, Agriculture & Pharmacy Common Entrance Test",
    short_code: "AP EAPCET",
    category: "state-cet",
    state: "Andhra Pradesh",
    streams: ["PCM", "PCB", "PCMB"],
    conducting_body: "APSCHE / JNTU Kakinada",
    official_website: "https://cets.apsche.ap.gov.in",
    application_url: "https://cets.apsche.ap.gov.in/EAPCET",
    eligibility_summary: "AP domicile; engineering (PCM) and agriculture/pharmacy (PCB) streams.",
    min_percentage: "45% in group subjects (40% reserved)",
    age_limit: "16 years as on 31 December",
    pattern: "CBT · 160 questions · 3 hrs · no negative marking",
    fees: [
      { category_label: "General", amount: 700 },
      { category_label: "SC / ST", amount: 500 },
    ],
    dates: [
      {
        event_type: "registration_open",
        label: "Application opens",
        start_datetime: d(2027, 2, 10),
      },
      {
        event_type: "registration_close",
        label: "Application closes",
        start_datetime: d(2027, 3, 28, 23, 50),
      },
      {
        event_type: "exam_date",
        label: "Exam window",
        start_datetime: d(2027, 5, 12),
        end_datetime: d(2027, 5, 18),
        is_tentative: true,
      },
    ],
  },
  {
    slug: "keam",
    full_name: "Kerala Engineering, Architecture and Medical Entrance",
    short_code: "KEAM",
    category: "state-cet",
    state: "Kerala",
    streams: ["PCM", "PCB", "PCMB"],
    conducting_body: "Commissioner for Entrance Examinations, Kerala",
    official_website: "https://cee.kerala.gov.in",
    application_url: "https://cee.kerala.gov.in",
    eligibility_summary: "Kerala nativity for state quota; PCM for engineering, PCB for pharmacy.",
    min_percentage: "45% in PCM (40% reserved)",
    age_limit: "Minimum 17 years as on 31 December",
    pattern: "CBT · Physics & Chemistry + Mathematics papers · +4 / -1",
    fees: [
      { category_label: "General", amount: 875 },
      { category_label: "SC", amount: 375 },
    ],
    dates: [
      {
        event_type: "registration_open",
        label: "Application opens",
        start_datetime: d(2027, 2, 5),
      },
      {
        event_type: "registration_close",
        label: "Application closes",
        start_datetime: d(2027, 3, 10, 23, 50),
      },
      {
        event_type: "exam_date",
        label: "Exam window",
        start_datetime: d(2027, 4, 22),
        end_datetime: d(2027, 4, 28),
        is_tentative: true,
      },
    ],
  },
  {
    slug: "gujcet",
    full_name: "Gujarat Common Entrance Test",
    short_code: "GUJCET",
    category: "state-cet",
    state: "Gujarat",
    streams: ["PCM", "PCB", "PCMB"],
    conducting_body: "Gujarat Secondary and Higher Secondary Education Board",
    official_website: "https://gseb.org",
    application_url: "https://gujcet.gseb.org",
    eligibility_summary: "Gujarat board 12th science (Group A: PCM, Group B: PCB).",
    min_percentage: "Pass in 12th science",
    age_limit: "No upper age limit",
    pattern: "OMR · 120 questions · 3 hrs · +1 / -0.25",
    fees: [{ category_label: "All categories", amount: 350 }],
    dates: [
      {
        event_type: "registration_open",
        label: "Application opens",
        start_datetime: d(2026, 12, 15),
      },
      {
        event_type: "registration_close",
        label: "Application closes",
        start_datetime: d(2027, 1, 15, 23, 50),
      },
      {
        event_type: "exam_date",
        label: "Exam day",
        start_datetime: d(2027, 3, 28, 10, 0),
        is_tentative: true,
      },
    ],
  },
  {
    slug: "ojee",
    full_name: "Odisha Joint Entrance Examination",
    short_code: "OJEE",
    category: "state-cet",
    state: "Odisha",
    streams: ["PCM", "PCB", "PCMB"],
    conducting_body: "OJEE Board",
    official_website: "https://ojee.nic.in",
    application_url: "https://ojee.nic.in",
    eligibility_summary:
      "Odisha domicile for state quota; pharmacy and allied UG courses post-12th.",
    min_percentage: "45% in PCM / PCB (40% reserved)",
    age_limit: "No upper age limit",
    pattern: "CBT · course-specific papers · +4 / -1",
    fees: [{ category_label: "All categories", amount: 1000 }],
    dates: [
      {
        event_type: "registration_open",
        label: "Application opens",
        start_datetime: d(2027, 1, 25),
      },
      {
        event_type: "registration_close",
        label: "Application closes",
        start_datetime: d(2027, 3, 15, 23, 50),
      },
      {
        event_type: "exam_date",
        label: "Exam window",
        start_datetime: d(2027, 5, 6),
        end_datetime: d(2027, 5, 10),
        is_tentative: true,
      },
    ],
  },
  {
    slug: "bcece",
    full_name: "Bihar Combined Entrance Competitive Examination",
    short_code: "BCECE",
    category: "state-cet",
    state: "Bihar",
    streams: ["PCM", "PCB", "PCMB"],
    conducting_body: "BCECE Board",
    official_website: "https://bceceboard.bihar.gov.in",
    application_url: "https://bceceboard.bihar.gov.in",
    eligibility_summary:
      "Bihar domicile; agriculture and allied UG streams (PCB / PCM / PCMB groups).",
    min_percentage: "45% in group subjects (40% reserved)",
    age_limit: "Minimum 17 years",
    pattern: "OMR · subject-wise papers · +4 / -1",
    fees: [
      { category_label: "General (2 subjects)", amount: 1100 },
      { category_label: "SC / ST", amount: 550 },
    ],
    dates: [
      {
        event_type: "registration_open",
        label: "Application opens",
        start_datetime: d(2027, 3, 5),
      },
      {
        event_type: "registration_close",
        label: "Application closes",
        start_datetime: d(2027, 4, 10, 23, 50),
      },
      {
        event_type: "exam_date",
        label: "Exam day",
        start_datetime: d(2027, 5, 30),
        is_tentative: true,
      },
    ],
  },
];

/** The admission cycle the seeded dates belong to. */
export const BASE_CYCLE_YEAR = 2027;

/** Attempt years students can plan for. */
export const ATTEMPT_YEARS = [2026, 2027, 2028, 2029];

const shiftIso = (iso: string, years: number) => {
  const dt = new Date(iso);
  dt.setUTCFullYear(dt.getUTCFullYear() + years);
  return dt.toISOString();
};

/** Project an exam's calendar onto another attempt year. */
export function shiftExamToCycle(exam: Exam, year: number): Exam {
  const delta = year - BASE_CYCLE_YEAR;
  if (delta === 0) return exam;
  return {
    ...exam,
    dates: exam.dates.map((d0) => ({
      ...d0,
      start_datetime: shiftIso(d0.start_datetime, delta),
      ...(d0.end_datetime ? { end_datetime: shiftIso(d0.end_datetime, delta) } : {}),
      is_tentative: true,
    })),
  };
}

export const examsForCycle = (year: number) => EXAMS.map((e) => shiftExamToCycle(e, year));

export const getExam = (slug: string, year = BASE_CYCLE_YEAR) => {
  const exam = EXAMS.find((e) => e.slug === slug);
  return exam ? shiftExamToCycle(exam, year) : undefined;
};
