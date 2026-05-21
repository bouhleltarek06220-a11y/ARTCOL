-- ============================================================
-- ARTCOL — Migration Phase 5 (collaborations entre artistes)
-- À exécuter dans : Supabase Dashboard → SQL Editor
-- Prérequis : avoir déjà exécuté 003_phase4_follows.sql
-- ============================================================

-- ============================================================
-- ENUM : statut d'une collaboration
-- ============================================================
do $$ begin
  create type collab_status as enum (
    'pending',     -- envoyée, en attente de réponse
    'accepted',    -- acceptée par le destinataire
    'declined',    -- refusée par le destinataire
    'cancelled'    -- annulée par l'initiateur
  );
exception
  when duplicate_object then null;
end $$;

-- ============================================================
-- TABLE : collaborations
-- ============================================================
create table if not exists public.collaborations (
  id uuid default gen_random_uuid() primary key,
  initiator_id uuid not null references public.profiles(id) on delete cascade,
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(title) >= 3 and char_length(title) <= 120),
  description text check (description is null or char_length(description) <= 2000),
  status collab_status default 'pending' not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  responded_at timestamptz,
  constraint collabs_no_self check (initiator_id <> recipient_id)
);

create index if not exists collabs_initiator_idx on public.collaborations(initiator_id, created_at desc);
create index if not exists collabs_recipient_idx on public.collaborations(recipient_id, created_at desc);
create index if not exists collabs_status_idx on public.collaborations(status);

drop trigger if exists on_collabs_updated on public.collaborations;
create trigger on_collabs_updated
  before update on public.collaborations
  for each row execute function public.handle_updated_at();

-- ============================================================
-- RLS — collaborations
-- Visibilité : seuls initiateur et destinataire voient la collab
-- Initiateur : peut INSERT (avec lui-même comme initiator)
-- Initiateur : peut UPDATE statut vers 'cancelled' uniquement
-- Destinataire : peut UPDATE statut vers 'accepted' ou 'declined' uniquement
-- Pour simplifier le RLS, on autorise UPDATE par les 2 parties et on
-- contrôle la transition de statut côté client + via un trigger garde-fou
-- ============================================================
alter table public.collaborations enable row level security;

drop policy if exists "collabs_select_involved" on public.collaborations;
create policy "collabs_select_involved"
  on public.collaborations for select
  to authenticated
  using (auth.uid() = initiator_id or auth.uid() = recipient_id);

drop policy if exists "collabs_insert_as_initiator" on public.collaborations;
create policy "collabs_insert_as_initiator"
  on public.collaborations for insert
  to authenticated
  with check (auth.uid() = initiator_id);

drop policy if exists "collabs_update_involved" on public.collaborations;
create policy "collabs_update_involved"
  on public.collaborations for update
  to authenticated
  using (auth.uid() = initiator_id or auth.uid() = recipient_id)
  with check (auth.uid() = initiator_id or auth.uid() = recipient_id);

drop policy if exists "collabs_delete_initiator" on public.collaborations;
create policy "collabs_delete_initiator"
  on public.collaborations for delete
  to authenticated
  using (auth.uid() = initiator_id);

-- ============================================================
-- TRIGGER garde-fou : transitions de statut valides + responded_at auto
-- ============================================================
create or replace function public.handle_collab_status_transition()
returns trigger as $$
begin
  -- Le statut n'a pas changé : rien à valider
  if new.status = old.status then
    return new;
  end if;

  -- Transitions valides :
  --   pending -> accepted (par destinataire)
  --   pending -> declined (par destinataire)
  --   pending -> cancelled (par initiateur)
  -- Toute autre transition est rejetée.
  if old.status <> 'pending' then
    raise exception 'Cannot change status from % (collab finalisée)', old.status;
  end if;

  if new.status = 'cancelled' then
    if auth.uid() <> old.initiator_id then
      raise exception 'Seul l''initiateur peut annuler la collab';
    end if;
  elsif new.status in ('accepted', 'declined') then
    if auth.uid() <> old.recipient_id then
      raise exception 'Seul le destinataire peut accepter ou refuser';
    end if;
    new.responded_at = now();
  else
    raise exception 'Statut % non autorisé en transition', new.status;
  end if;

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_collabs_status_change on public.collaborations;
create trigger on_collabs_status_change
  before update on public.collaborations
  for each row execute function public.handle_collab_status_transition();
