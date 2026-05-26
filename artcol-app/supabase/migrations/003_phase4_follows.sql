-- ============================================================
-- ARTCOL — Migration Phase 4 (système follow + recherche)
-- À exécuter dans : Supabase Dashboard → SQL Editor
-- Prérequis : avoir déjà exécuté schema.sql et 002_phase3_feed.sql
-- ============================================================

-- ============================================================
-- TABLE : follows
-- Modèle Instagram-like asymétrique (pas de demande d'amitié)
-- ============================================================
create table if not exists public.follows (
  follower_id uuid not null references public.profiles(id) on delete cascade,
  followed_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz default now() not null,
  primary key (follower_id, followed_id),
  constraint follows_no_self check (follower_id <> followed_id)
);

create index if not exists follows_followed_idx on public.follows(followed_id);
create index if not exists follows_follower_idx on public.follows(follower_id);

-- ============================================================
-- RLS — follows
-- Lecture publique pour authentifiés (transparence du graphe social)
-- Un user ne peut créer/supprimer QUE ses propres follows
-- ============================================================
alter table public.follows enable row level security;

drop policy if exists "follows_select_authenticated" on public.follows;
create policy "follows_select_authenticated"
  on public.follows for select
  to authenticated
  using (true);

drop policy if exists "follows_insert_own" on public.follows;
create policy "follows_insert_own"
  on public.follows for insert
  to authenticated
  with check (auth.uid() = follower_id);

drop policy if exists "follows_delete_own" on public.follows;
create policy "follows_delete_own"
  on public.follows for delete
  to authenticated
  using (auth.uid() = follower_id);
