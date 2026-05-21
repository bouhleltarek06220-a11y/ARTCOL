-- ============================================================
-- ARTCOL — Migration Phase 3 (feed posts + likes + commentaires)
-- À exécuter dans : Supabase Dashboard → SQL Editor
-- Prérequis : avoir déjà exécuté schema.sql (Phase 1)
-- ============================================================

create extension if not exists "pgcrypto";

-- ============================================================
-- TABLE : posts
-- Un post a obligatoirement du texte OU une photo (ou les deux)
-- ============================================================
create table if not exists public.posts (
  id uuid default gen_random_uuid() primary key,
  author_id uuid not null references public.profiles(id) on delete cascade,
  text text check (text is null or (char_length(text) >= 1 and char_length(text) <= 2000)),
  photo_url text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  constraint posts_text_or_photo check (text is not null or photo_url is not null)
);

create index if not exists posts_author_idx on public.posts(author_id);
create index if not exists posts_created_at_idx on public.posts(created_at desc);

drop trigger if exists on_posts_updated on public.posts;
create trigger on_posts_updated
  before update on public.posts
  for each row execute function public.handle_updated_at();

-- ============================================================
-- TABLE : post_likes (relation many-to-many users <-> posts)
-- ============================================================
create table if not exists public.post_likes (
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz default now() not null,
  primary key (post_id, user_id)
);

create index if not exists post_likes_user_idx on public.post_likes(user_id);

-- ============================================================
-- TABLE : post_comments
-- ============================================================
create table if not exists public.post_comments (
  id uuid default gen_random_uuid() primary key,
  post_id uuid not null references public.posts(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  text text not null check (char_length(text) >= 1 and char_length(text) <= 500),
  created_at timestamptz default now() not null
);

create index if not exists post_comments_post_idx on public.post_comments(post_id, created_at);

-- ============================================================
-- RLS — posts
-- Lecture publique pour authentifiés, écriture restreinte au propriétaire
-- ============================================================
alter table public.posts enable row level security;

drop policy if exists "posts_select_authenticated" on public.posts;
create policy "posts_select_authenticated"
  on public.posts for select
  to authenticated
  using (true);

drop policy if exists "posts_insert_own" on public.posts;
create policy "posts_insert_own"
  on public.posts for insert
  to authenticated
  with check (auth.uid() = author_id);

drop policy if exists "posts_update_own" on public.posts;
create policy "posts_update_own"
  on public.posts for update
  to authenticated
  using (auth.uid() = author_id)
  with check (auth.uid() = author_id);

drop policy if exists "posts_delete_own" on public.posts;
create policy "posts_delete_own"
  on public.posts for delete
  to authenticated
  using (auth.uid() = author_id);

-- ============================================================
-- RLS — post_likes
-- ============================================================
alter table public.post_likes enable row level security;

drop policy if exists "post_likes_select_authenticated" on public.post_likes;
create policy "post_likes_select_authenticated"
  on public.post_likes for select
  to authenticated
  using (true);

drop policy if exists "post_likes_insert_own" on public.post_likes;
create policy "post_likes_insert_own"
  on public.post_likes for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "post_likes_delete_own" on public.post_likes;
create policy "post_likes_delete_own"
  on public.post_likes for delete
  to authenticated
  using (auth.uid() = user_id);

-- ============================================================
-- RLS — post_comments
-- ============================================================
alter table public.post_comments enable row level security;

drop policy if exists "post_comments_select_authenticated" on public.post_comments;
create policy "post_comments_select_authenticated"
  on public.post_comments for select
  to authenticated
  using (true);

drop policy if exists "post_comments_insert_own" on public.post_comments;
create policy "post_comments_insert_own"
  on public.post_comments for insert
  to authenticated
  with check (auth.uid() = author_id);

drop policy if exists "post_comments_update_own" on public.post_comments;
create policy "post_comments_update_own"
  on public.post_comments for update
  to authenticated
  using (auth.uid() = author_id)
  with check (auth.uid() = author_id);

drop policy if exists "post_comments_delete_own" on public.post_comments;
create policy "post_comments_delete_own"
  on public.post_comments for delete
  to authenticated
  using (auth.uid() = author_id);

-- ============================================================
-- STORAGE — bucket posts (photos des posts)
-- Path convention : {user_id}/{filename}.jpg
-- ============================================================
insert into storage.buckets (id, name, public)
values ('posts', 'posts', true)
on conflict (id) do nothing;

drop policy if exists "posts_storage_public_read" on storage.objects;
create policy "posts_storage_public_read"
  on storage.objects for select
  using (bucket_id = 'posts');

drop policy if exists "posts_storage_own_upload" on storage.objects;
create policy "posts_storage_own_upload"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'posts'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "posts_storage_own_update" on storage.objects;
create policy "posts_storage_own_update"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'posts'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "posts_storage_own_delete" on storage.objects;
create policy "posts_storage_own_delete"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'posts'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
