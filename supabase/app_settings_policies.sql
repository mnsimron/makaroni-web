-- Run this in the Supabase SQL editor.
-- The service-role client is used only by the protected /admin server route.

alter table public.app_settings
add column if not exists orders_open boolean not null default true;

grant select on table public.app_settings to anon, authenticated;
grant update on table public.app_settings to authenticated;

alter table public.app_settings enable row level security;

drop policy if exists "Public can read app settings" on public.app_settings;
create policy "Public can read app settings"
on public.app_settings
for select
to anon, authenticated
using (true);

drop policy if exists "Authenticated users can update app settings" on public.app_settings;
create policy "Authenticated users can update app settings"
on public.app_settings
for update
to authenticated
using (true)
with check (true);
