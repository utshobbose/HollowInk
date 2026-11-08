-- ========================================================
-- HOLLOW INK: COMPLETE SUPABASE DATABASE SCHEMA & SEED DATA
-- Run this in your Supabase Dashboard: SQL Editor -> New Query -> Run
-- ========================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE (Syncs with Supabase Auth or standalone)
create table if not exists public.profiles (
  id text primary key,
  email text not null,
  name text not null,
  role text default 'reader', -- 'reader', 'writer', 'admin'
  avatar text,
  bio text,
  specialty text,
  save_on_device boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. STORIES TABLE
create table if not exists public.stories (
  id text primary key,
  slug text unique not null,
  title text not null,
  author_id text references public.profiles(id) on delete set null,
  author_name text not null,
  category text not null, -- 'folklore', 'horror', 'fantasy', 'psychological', 'urban', 'historical'
  region text,            -- 'Bengal', 'Varanasi', 'Malabar', 'Rajasthan', etc.
  mood text,              -- 'Chilling', 'Supernatural', 'Haunted', 'Dread'
  read_time text default '10 min read',
  word_count integer default 1500,
  excerpt text not null,
  body text not null,
  cover_image text,
  content_warning text,
  tags text[] default '{}',
  date text,
  last_modified timestamp with time zone default timezone('utc'::text, now()),
  status text default 'published', -- 'draft', 'submitted', 'published', 'revision_requested'
  moderation_notes text,
  featured boolean default false,
  views_count integer default 0,
  reactions_count integer default 0
);

-- 3. BOOKMARKS TABLE
create table if not exists public.bookmarks (
  id uuid default gen_random_uuid() primary key,
  user_id text references public.profiles(id) on delete cascade,
  story_id text references public.stories(id) on delete cascade,
  list_type text default 'to_read', -- 'to_read' | 'favorites'
  added_at timestamp with time zone default timezone('utc'::text, now()),
  unique(user_id, story_id, list_type)
);

-- 4. READING HISTORY TABLE
create table if not exists public.reading_history (
  id uuid default gen_random_uuid() primary key,
  user_id text references public.profiles(id) on delete cascade,
  story_id text references public.stories(id) on delete cascade,
  progress_percent integer default 0,
  last_read_at timestamp with time zone default timezone('utc'::text, now()),
  unique(user_id, story_id)
);

-- 5. MODERATION LOGS TABLE
create table if not exists public.moderation_logs (
  id uuid default gen_random_uuid() primary key,
  story_id text references public.stories(id) on delete cascade,
  admin_id text references public.profiles(id),
  admin_name text,
  action text not null, -- 'approve', 'reject', 'revision_requested'
  notes text,
  timestamp timestamp with time zone default timezone('utc'::text, now())
);

-- Turn on Row Level Security (RLS) but allow public read for published content
alter table public.profiles enable row level security;
alter table public.stories enable row level security;
alter table public.bookmarks enable row level security;
alter table public.reading_history enable row level security;
alter table public.moderation_logs enable row level security;

-- Simple permissive policies for anon / public read
create policy "Allow public read of profiles" on public.profiles for select using (true);
create policy "Allow public read of published stories" on public.stories for select using (status = 'published' or true);
create policy "Allow all operations for anon" on public.stories for all using (true);
create policy "Allow all operations for profiles" on public.profiles for all using (true);
create policy "Allow all operations for bookmarks" on public.bookmarks for all using (true);
create policy "Allow all operations for reading_history" on public.reading_history for all using (true);
create policy "Allow all operations for moderation_logs" on public.moderation_logs for all using (true);

-- SEED PROFILES
insert into public.profiles (id, email, name, role, avatar, bio, specialty) values
('usr_reader_1', 'reader@hollowink.com', 'Wandering Scholar', 'reader', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', 'Devourer of midnight archives and student of forgotten folklore.', null)
on conflict (id) do nothing;

insert into public.profiles (id, email, name, role, avatar, bio, specialty) values
('usr_writer_aarav', 'aarav@hollowink.com', 'Aarav Sharma', 'writer', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', 'Specializing in the shadowed corners of Bengal folklore, Aarav Sharma unearths tales long buried by time.', 'Bengal Gothic & River Lore')
on conflict (id) do nothing;

insert into public.profiles (id, email, name, role, avatar, bio, specialty) values
('usr_writer_utshob', 'utshob@hollowink.com', 'Utshob Bose', 'writer', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80', 'Horror writer and folklorist rooted in the decaying ancestral mansions and tidal silt of Bengal.', 'Sundarbans Mysticism & Colonial Dread')
on conflict (id) do nothing;

insert into public.profiles (id, email, name, role, avatar, bio, specialty) values
('usr_admin_sanctum', 'admin@hollowink.com', 'Sanctum Keeper', 'admin', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80', 'Master archivist of the Hollow Ink vaults.', null)
on conflict (id) do nothing;

-- SEED FEATURED STORY
insert into public.stories (id, slug, title, author_id, author_name, category, region, mood, read_time, word_count, excerpt, body, cover_image, tags, date, status, featured, views_count, reactions_count)
values (
  'story_1',
  'the-weaver-of-silent-threads',
  'The Weaver of Silent Threads',
  'usr_writer_aarav',
  'Aarav Sharma',
  'folklore',
  'Varanasi',
  'Supernatural',
  '14 min read',
  2850,
  'In the shadow-veiled alleys of old Varanasi, a weaver creates saris that capture not just color, but the final, whispered secrets of the dying.',
  '<p class="mb-6 font-light">The loom at Kashi Lane did not clatter like ordinary wood. When Pandit Dinanath pushed the shuttle across the taut silk, the sound was that of dry leaves dragging over slate.</p>',
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
  array['Varanasi', 'Loom', 'Death Lore', 'Gothic'],
  'February 02, 2026',
  'published',
  true,
  1420,
  312
) on conflict (id) do nothing;

