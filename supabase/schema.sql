-- =====================================================================
-- Run this ONCE in Supabase: SQL Editor > New query > paste > Run
-- Creates the tables, the photo storage bucket, the security rules and
-- your 14 starter cars from the flyer.
-- =====================================================================

-- ---------- Vehicles ----------
create table if not exists public.vehicles (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  make          text not null,
  model         text not null,
  year          int,
  price         numeric not null check (price > 0),   -- regular price (N$)
  sale_price    numeric check (sale_price > 0),       -- discounted price, empty = no discount
  mileage       int,
  transmission  text,
  fuel          text,
  engine        text,
  colour        text,
  condition     text,
  description   text,
  specs         text[] not null default '{}',
  images        text[] not null default '{}',         -- first image = main photo
  featured      boolean not null default false,
  sold          boolean not null default false,
  is_import     boolean not null default false,
  hidden        boolean not null default false         -- owner chose to hide it from the website
);

-- ---------- Website settings (always exactly one row, id = 1) ----------
create table if not exists public.site_settings (
  id          int primary key check (id = 1),
  data        jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);
insert into public.site_settings (id, data) values (1, '{}'::jsonb) on conflict (id) do nothing;

-- ---------- Security: everyone can READ, only the signed-in owner can WRITE ----------
alter table public.vehicles      enable row level security;
alter table public.site_settings enable row level security;

drop policy if exists "Anyone can view vehicles" on public.vehicles;
drop policy if exists "Owner can add vehicles" on public.vehicles;
drop policy if exists "Owner can edit vehicles" on public.vehicles;
drop policy if exists "Owner can delete vehicles" on public.vehicles;
create policy "Anyone can view vehicles" on public.vehicles for select using (true);
create policy "Owner can add vehicles"   on public.vehicles for insert to authenticated with check (true);
create policy "Owner can edit vehicles"  on public.vehicles for update to authenticated using (true) with check (true);
create policy "Owner can delete vehicles" on public.vehicles for delete to authenticated using (true);

drop policy if exists "Anyone can view settings" on public.site_settings;
drop policy if exists "Owner can add settings" on public.site_settings;
drop policy if exists "Owner can edit settings" on public.site_settings;
create policy "Anyone can view settings" on public.site_settings for select using (true);
create policy "Owner can add settings"   on public.site_settings for insert to authenticated with check (true);
create policy "Owner can edit settings"  on public.site_settings for update to authenticated using (true) with check (true);

-- ---------- Photo storage ----------
insert into storage.buckets (id, name, public)
values ('vehicle-images', 'vehicle-images', true)
on conflict (id) do nothing;

drop policy if exists "Anyone can view photos" on storage.objects;
drop policy if exists "Owner can upload photos" on storage.objects;
drop policy if exists "Owner can replace photos" on storage.objects;
drop policy if exists "Owner can delete photos" on storage.objects;
create policy "Anyone can view photos"   on storage.objects for select using (bucket_id = 'vehicle-images');
create policy "Owner can upload photos"  on storage.objects for insert to authenticated with check (bucket_id = 'vehicle-images');
create policy "Owner can replace photos" on storage.objects for update to authenticated using (bucket_id = 'vehicle-images');
create policy "Owner can delete photos"  on storage.objects for delete to authenticated using (bucket_id = 'vehicle-images');

-- ---------- Make new cars appear on open pages instantly ----------
do $$
begin
  alter publication supabase_realtime add table public.vehicles;
exception when duplicate_object then null;
end $$;

-- ---------- Starter cars from the flyer (edit or delete them in the owner portal) ----------
-- Year, mileage, colour etc. are not on the flyer, so they are left empty.
insert into public.vehicles (make, model, year, price, is_import, featured, description, created_at)
select v.make, v.model, v.year, v.price, true, v.featured,
  'Imported to order from Japan. A 75% deposit is required and delivery takes 3 to 4 months. Contact us to confirm the exact year, mileage, colour and specification before you order.',
  now() - (v.n || ' days')::interval
from (values
  (0,  'Volkswagen', 'Golf 8R',     null::int, 668000, true),
  (1,  'Volkswagen', 'Golf 7.5R',   null,      369000, true),
  (2,  'Volkswagen', 'Golf 7R',     null,      250000, true),
  (3,  'Volkswagen', 'Golf 7 GTi',  null,      180000, true),
  (4,  'Audi',       'A3',          2014,      128000, true),
  (5,  'Volkswagen', 'Polo GT',     null,      130000, false),
  (6,  'Volkswagen', 'Golf 7 TSi',  null,      128000, false),
  (7,  'Volkswagen', 'Polo TSi',    2015,      115000, false),
  (8,  'Volkswagen', 'Polo GTi',    null,      130000, false),
  (9,  'Mazda',      'Demio',       null,       65000, false),
  (10, 'Honda',      'Fit',         null,       65000, false),
  (11, 'Nissan',     'March',       null,       55000, false),
  (12, 'Nissan',     'Tiida',       null,       60000, false),
  (13, 'Nissan',     'Note',        null,       60000, false)
) as v(n, make, model, year, price, featured)
where not exists (select 1 from public.vehicles);