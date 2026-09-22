# Exam Companion

Act as a Principal Full-Stack Engineer and Product Architect. Build an end-to-end multi-platform app (React Native / Flutter or Next.js PWA) called "EduAlert PCMB" designed to track and notify Indian students about competitive exam registrations, admit cards, and deadlines across PCMB streams.

---

### 1. Target Exam Scope (PCMB Categories)

The app must catalog and filter competitive exams across these five primary categories:

- **Engineering (PCM):** JEE Main, JEE Advanced, BITSAT, VITEEE, SRMJEEE, MET, AEEE.

- **Medical & Allied Sciences (PCB):** NEET-UG, ICAR AIEEA-UG, AIIMS Paramedical/B.Sc. Nursing, NEST.

- **Defense & Armed Forces (PCM/PCMB):** NDA & NA (I & II), Indian Army TES, AFCAT (post-12th schemes/entry).

- **Research & Pure Sciences (PCMB):** IISER Aptitude Test (IAT), NEST (NISER/UM-DAE CEBS), ISI Admission Test, CMI Entrance Exam.

- **State CETs & Regional Entrances:** MHT CET (MH), KCET & COMEDK (KA), WBJEE (WB), TS EAMCET/TG EAPCET, AP EAPCET, KEAM (KL), GUJCET (GJ), OJEE (OD), BCECE (BR).

---

### 2. Core Functional Requirements

1. **Student Onboarding & Personalization:**

   - Stream selection: PCM, PCB, PCMB.

   - State of domicile selection (for regional quota and state CET alerts).

   - Target career pathways (Engineering, MBBS/BDS, Pure Science/Research, Defense, Paramedical).

   - Toggle to follow specific exams and hide irrelevant ones.

2. **Smart Deadline & Event Tracker:**

   - Track sequential stages for each exam:

     - Notification Released / Information Bulletin Out

     - Registration Opens & Closes (with late-fee window)

     - Correction Window Open & Close

     - City Intimation Slip & Admit Card Release

     - Exam Dates (Phases/Sessions)

     - Provisional Answer Key & Challenge Window

     - Final Result & Counseling Registration

   - Visual status pill indicators: `Upcoming`, `Registration Open`, `Last 48 Hours`, `Closed`, `Admit Card Live`.

3. **Notification Engine & Trigger Rules:**

   - Notification channels: In-App push notifications (FCM), optional WhatsApp/SMS integration.

   - Automated reminder triggers:

     - **T-30 days / Announcement:** "Registration open for [Exam Name]"

     - **T-7 days:** "1 week left to apply"

     - **T-48 hours & T-12 hours:** "Urgent: Registration closes tonight at 11:50 PM"

     - **Event-based triggers:** Immediate push when Admit Card or Answer Key is published.

   - DND & Priority filters: Allow users to mark 3 "Dream Exams" for high-priority bypass notifications.

4. **Exam Detail Page (Knowledge Hub):**

   - Direct, verified one-click link to the official application portal (e.g., jeemain.nta.nic.in, neet.nta.online).

   - Quick-glance card: Eligibility criteria (minimum % in 12th, age limits, compulsory subjects), application fee (General/OBC/SC/ST/Female), exam pattern (duration, negative marking, mode: CBT/OMR).

   - Syllabus PDF and previous year official bulletin downloads.

5. **Personal Application Tracker:**

   - Local user checklist: "Applied", "Fee Paid", "Admit Card Downloaded".

   - Note-taking field for Application Number and Login ID storage (stored locally/encrypted on-device).

---

### 3. Data Schema Specifications

Design a relational schema (PostgreSQL / Supabase Prisma schema) containing:

- `exams`: id, slug, full_name, short_code, category, conducting_body (NTA, UPSC, State Cell), official_website, application_url, eligibility_summary.

- `exam_dates`: id, exam_id, event_type (ENUM), start_datetime, end_datetime, is_tentative, is_extended.

- `exam_fees`: id, exam_id, category_label, amount, currency.

- `user_preferences`: user_id, stream (PCM/PCB/PCMB), home_state, followed_exam_ids.

- `notifications_queue`: id, user_id, exam_id, scheduled_at, sent_at, channel, payload, status.

---

### 4. Technical Stack & Implementation Deliverables

- **Frontend:** React Native (Expo) or Next.js 14 App Router + Tailwind CSS + Shadcn UI.

- **Backend:** Node.js (Fastify/Express) or Next.js Server Actions + Supabase (PostgreSQL + Auth + Row Level Security).

- **Scheduled Jobs:** Cron workers (Inngest / Upstash QStash / BullMQ) to evaluate deadline timestamps every hour and dispatch queued push notifications via Firebase Cloud Messaging (FCM).

- **Admin / Scraper CMS:** A lightweight admin panel where admins can add or modify dates, toggle `is_tentative` to `confirmed`, and send blast announcements.

---

### Output Needed:

1. Provide the complete Prisma schema for the database.

2. Outline the API route or server function that handles push notification scheduling based on deadline timestamps.

3. Build the primary Mobile/Web Dashboard component displaying the filterable exam cards, countdown timers, and registration action buttons.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://exam-navi-hub.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/5dfa68f7-762f-484f-aaed-84a682ea48fe).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
