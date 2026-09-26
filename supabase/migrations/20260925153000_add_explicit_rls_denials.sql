-- Public/client roles do not need direct access to these server-managed tables.
-- Explicit false policies document that deny-by-default choice for the linter.
do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'exams',
    'exam_dates',
    'official_updates',
    'exam_revisions',
    'exam_sources'
  ]
  loop
    if to_regclass('public.' || table_name) is not null then
      execute format(
        'drop policy if exists %I on public.%I',
        table_name || '_deny_public_read',
        table_name
      );
      execute format(
        'create policy %I on public.%I for select to anon, authenticated using (false)',
        table_name || '_deny_public_read',
        table_name
      );
    end if;
  end loop;
end
$$;
