create table if not exists public.exam_sources (
  exam_slug text primary key,
  official_url text not null,
  application_url text not null,
  conducting_body text not null,
  source_name text not null,
  updated_at timestamptz not null default now()
);

alter table public.exam_sources enable row level security;
revoke all on table public.exam_sources from anon, authenticated;

insert into public.exam_sources
  (exam_slug, official_url, application_url, conducting_body, source_name)
values
  ('jee-main', 'https://jeemain.nta.nic.in', 'https://jeemain.nta.nic.in', 'National Testing Agency (NTA)', 'JEE Main official website'),
  ('jee-advanced', 'https://jeeadv.ac.in', 'https://jeeadv.ac.in', 'IIT (rotating zonal IIT)', 'JEE Advanced official website'),
  ('bitsat', 'https://www.bitsadmission.com', 'https://www.bitsadmission.com', 'BITS Pilani', 'BITSAT official website'),
  ('viteee', 'https://viteee.vit.ac.in', 'https://viteee.vit.ac.in', 'Vellore Institute of Technology', 'VITEEE official website'),
  ('srmjeee', 'https://www.srmist.edu.in', 'https://applications.srmist.edu.in', 'SRM Institute of Science and Technology', 'SRMJEEE official website'),
  ('met', 'https://manipal.edu', 'https://manipal.edu/mu/admission.html', 'Manipal Academy of Higher Education', 'MET official website'),
  ('aeee', 'https://www.amrita.edu', 'https://amrita.edu/btech', 'Amrita Vishwa Vidyapeetham', 'AEEE official website'),
  ('neet-ug', 'https://neet.nta.nic.in', 'https://neet.nta.nic.in', 'National Testing Agency (NTA)', 'NEET UG official website'),
  ('icar-aieea-ug', 'https://icar.nta.ac.in', 'https://icar.nta.ac.in', 'National Testing Agency for ICAR', 'ICAR AIEEA UG official website'),
  ('aiims-bsc-nursing', 'https://www.aiimsexams.ac.in', 'https://www.aiimsexams.ac.in', 'AIIMS New Delhi', 'AIIMS Nursing official website'),
  ('nda-na', 'https://upsc.gov.in', 'https://upsconline.nic.in', 'Union Public Service Commission', 'NDA official website'),
  ('army-tes', 'https://joinindianarmy.nic.in', 'https://joinindianarmy.nic.in', 'Indian Army', 'Army TES official website'),
  ('afcat', 'https://afcat.cdac.in', 'https://afcat.cdac.in', 'Indian Air Force', 'AFCAT official website'),
  ('iiser-iat', 'https://www.iiseradmission.in', 'https://www.iiseradmission.in', 'IISER Admissions', 'IISER IAT official website'),
  ('nest', 'https://www.nestexam.in', 'https://www.nestexam.in', 'NISER and UM-DAE CEBS', 'NEST official website'),
  ('isi-admission-test', 'https://www.isical.ac.in', 'https://www.isical.ac.in/admissions', 'Indian Statistical Institute', 'ISI Admission official website'),
  ('cmi-entrance', 'https://www.cmi.ac.in', 'https://www.cmi.ac.in/admissions', 'Chennai Mathematical Institute', 'CMI Entrance official website'),
  ('mht-cet', 'https://cetcell.mahacet.org', 'https://cetcell.mahacet.org', 'Maharashtra State CET Cell', 'MHT CET official website'),
  ('kcet', 'https://cetonline.karnataka.gov.in', 'https://cetonline.karnataka.gov.in/kea', 'Karnataka Examinations Authority', 'KCET official website'),
  ('comedk-uget', 'https://www.comedk.org', 'https://www.comedk.org', 'COMEDK', 'COMEDK UGET official website'),
  ('wbjee', 'https://wbjeeb.nic.in', 'https://wbjeeb.nic.in', 'West Bengal Joint Entrance Examinations Board', 'WBJEE official website'),
  ('ts-eapcet', 'https://eapcet.tgche.ac.in', 'https://eapcet.tgche.ac.in', 'Telangana Council of Higher Education', 'TS EAPCET official website'),
  ('ap-eapcet', 'https://cets.apsche.ap.gov.in', 'https://cets.apsche.ap.gov.in/EAPCET', 'Andhra Pradesh State Council of Higher Education', 'AP EAPCET official website'),
  ('keam', 'https://cee.kerala.gov.in', 'https://cee.kerala.gov.in', 'Commissioner for Entrance Examinations Kerala', 'KEAM official website'),
  ('gujcet', 'https://gseb.org', 'https://gujcet.gseb.org', 'Gujarat Secondary and Higher Secondary Education Board', 'GUJCET official website'),
  ('ojee', 'https://ojee.nic.in', 'https://ojee.nic.in', 'Odisha Joint Entrance Examination', 'OJEE official website'),
  ('bcece', 'https://bceceboard.bihar.gov.in', 'https://bceceboard.bihar.gov.in', 'Bihar Combined Entrance Competitive Examination Board', 'BCECE official website')
on conflict (exam_slug) do nothing;
