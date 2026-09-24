create table if not exists public.official_sources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  organization text not null,
  exam_id text,
  source_url text not null,
  source_type text not null default 'official_page'
    check (source_type in ('official_page', 'official_document')),
  last_checked_at timestamptz,
  last_content_hash text,
  last_modified text,
  etag text,
  last_success_at timestamptz,
  status text not null default 'pending'
    check (status in ('pending', 'healthy', 'changed', 'failed', 'disabled')),
  check_interval_minutes integer not null default 360
    check (check_interval_minutes in (15, 30, 60, 180, 360, 720, 1440)),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (source_url, exam_id)
);

create table if not exists public.exam_notifications (
  id uuid primary key default gen_random_uuid(),
  exam_id text not null,
  source_id uuid not null references public.official_sources(id) on delete restrict,
  title text not null,
  summary text not null,
  notification_type text not null default 'OTHER'
    check (notification_type in (
      'REGISTRATION', 'EXAM_DATE', 'ADMIT_CARD', 'RESULT', 'CORRECTION',
      'SYLLABUS', 'ANSWER_KEY', 'IMPORTANT_NOTICE', 'DATE_CHANGE', 'OTHER'
    )),
  official_url text not null,
  document_url text,
  published_at timestamptz,
  detected_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  content_hash text not null,
  status text not null default 'PENDING_VERIFICATION'
    check (status in ('PENDING_VERIFICATION', 'VERIFIED', 'REJECTED')),
  is_new boolean not null default true,
  is_verified boolean not null default false,
  created_at timestamptz not null default now(),
  unique (source_id, official_url, content_hash)
);

create table if not exists public.exam_update_history (
  id uuid primary key default gen_random_uuid(),
  exam_id text not null,
  field_name text not null,
  old_value text,
  new_value text,
  source_id uuid not null references public.official_sources(id) on delete restrict,
  source_url text not null,
  detected_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.exam_date_revisions (
  id uuid primary key default gen_random_uuid(),
  exam_slug text not null,
  year integer not null,
  event_type text not null,
  label text,
  start_datetime timestamptz,
  end_datetime timestamptz,
  is_tentative boolean not null default false,
  is_extended boolean not null default false,
  source_url text not null,
  note text,
  status text not null default 'VERIFIED'
    check (status in ('PENDING', 'VERIFIED', 'REJECTED')),
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (exam_slug, year, event_type)
);

create table if not exists public.source_monitor_logs (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references public.official_sources(id) on delete cascade,
  checked_at timestamptz not null default now(),
  status text not null check (status in ('success', 'changed', 'failed', 'skipped')),
  http_status integer,
  duration_ms integer not null default 0,
  error_message text,
  items_found integer not null default 0
);

create index if not exists exam_notifications_exam_detected_idx
  on public.exam_notifications (exam_id, detected_at desc);
create index if not exists exam_notifications_new_idx
  on public.exam_notifications (is_new, detected_at desc);
create index if not exists source_monitor_logs_source_checked_idx
  on public.source_monitor_logs (source_id, checked_at desc);
create index if not exists exam_date_revisions_lookup_idx
  on public.exam_date_revisions (exam_slug, year, status);

alter table public.official_sources enable row level security;
alter table public.exam_notifications enable row level security;
alter table public.exam_update_history enable row level security;
alter table public.source_monitor_logs enable row level security;
alter table public.exam_date_revisions enable row level security;

create policy "Public can read verified notifications"
  on public.exam_notifications for select
  using (is_verified = true or status = 'PENDING_VERIFICATION');

create policy "Public can read official sources"
  on public.official_sources for select
  using (true);

create policy "Public can read verified date revisions"
  on public.exam_date_revisions for select
  using (status = 'VERIFIED');

create or replace function public.expire_exam_notification_badges()
returns void
language sql
security definer
set search_path = public
as $$
  update public.exam_notifications
  set is_new = false
  where is_new = true
    and detected_at < now() - interval '72 hours';
$$;
