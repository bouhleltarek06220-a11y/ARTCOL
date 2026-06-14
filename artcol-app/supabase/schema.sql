-- ============================================================
-- ARTCOL — Schéma Supabase Phase 1
-- À exécuter dans : Supabase Dashboard → SQL Editor
-- ============================================================

-- Extension UUID (active par défaut sur Supabase mais on s'assure)
create extension if not exists "uuid-ossp";

-- ============================================================
-- ENUM : domaines artistiques
-- ============================================================
do $$ begin
  create type art_domain as enum (
    'music',
    'dance',
    'visual_arts',
    'photography',
    'video',
    'writing',
    'theater',
    'craft',
    'other'
  );
exception
  when duplicate_object then null;
end $$;

-- ============================================================
-- TABLE : profiles
-- 1 profile = 1 user authentifié (relation 1-1 avec auth.users)
-- ============================================================
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  username text unique not null check (char_length(username) >= 3 and char_length(username) <= 30),
  display_name text not null check (char_length(display_name) >= 1 and char_length(display_name) <= 60),
  bio text check (char_length(bio) <= 500),
  art_domains art_domain[] default array[]::art_domain[],
  city text check (char_length(city) <= 60),
  avatar_url text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index if not exists profiles_username_idx on public.profiles(username);
create index if not exists profiles_art_domains_idx on public.profiles using gin(art_domains);

-- ============================================================
-- TRIGGER : updated_at auto
-- ============================================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists on_profiles_updated on public.profiles;
create trigger on_profiles_updated
  before update on public.profiles
  for each row execute function public.handle_updated_at();

-- ============================================================
-- TRIGGER : créer un profile auto à la création d'un user
-- ============================================================
create or replace function public.handle_new_user()
returns trigger as $$
declare
  base_username text;
  final_username text;
  counter int := 0;
begin
  -- Username de base depuis email ou metadata
  base_username := lower(
    coalesce(
      new.raw_user_meta_data->>'username',
      split_part(new.email, '@', 1)
    )
  );
  -- Nettoyer les caractères non alphanumériques
  base_username := regexp_replace(base_username, '[^a-z0-9_]', '', 'g');
  if char_length(base_username) < 3 then
    base_username := 'artist' || substr(new.id::text, 1, 6);
  end if;

  final_username := base_username;
  while exists (select 1 from public.profiles where username = final_username) loop
    counter := counter + 1;
    final_username := base_username || counter::text;
  end loop;

  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    final_username,
    coalesce(new.raw_user_meta_data->>'display_name', final_username)
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- RLS — Row Level Security
-- ============================================================
alter table public.profiles enable row level security;

-- Tout user authentifié peut LIRE tous les profils (réseau social public)
drop policy if exists "profiles_select_authenticated" on public.profiles;
create policy "profiles_select_authenticated"
  on public.profiles for select
  to authenticated
  using (true);

-- Un user peut UPDATE uniquement son propre profile
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Un user peut INSERT uniquement son propre profile (au cas où le trigger échoue)
drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

-- ============================================================
-- STORAGE — bucket avatars
-- ============================================================
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

drop policy if exists "avatars_public_read" on storage.objects;
create policy "avatars_public_read"
  on storage.objects for select
  using (bucket_id = 'avatars');

drop policy if exists "avatars_own_upload" on storage.objects;
create policy "avatars_own_upload"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "avatars_own_update" on storage.objects;
create policy "avatars_own_update"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "avatars_own_delete" on storage.objects;
create policy "avatars_own_delete"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
