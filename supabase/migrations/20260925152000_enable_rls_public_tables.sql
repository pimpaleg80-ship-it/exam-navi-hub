-- These legacy tables are not queried by the public client. Keep them
-- server-only until explicit, least-privilege read policies are required.
do $$
declare
  table_name text;
begin
  foreach table_name in array array['exams', 'exam_dates', 'official_updates']
  loop
    if to_regclass('public.' || table_name) is not null then
      execute format('alter table public.%I enable row level security', table_name);
      execute format('revoke all on table public.%I from anon, authenticated', table_name);
    end if;
  end loop;
end
$$;
