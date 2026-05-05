create extension if not exists pgcrypto;

create table public.listing_generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  source_category text,
  source_notes text,
  source_filename text,
  listing jsonb not null,
  images text[] not null default '{}',
  created_at timestamptz not null default timezone('utc', now())
);

create index listing_generations_user_id_created_at_idx
  on public.listing_generations (user_id, created_at desc);

alter table public.listing_generations enable row level security;

create policy "Users can view their own listing generations"
  on public.listing_generations
  for select
  using (auth.uid() = user_id);

create policy "Users can insert their own listing generations"
  on public.listing_generations
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own listing generations"
  on public.listing_generations
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own listing generations"
  on public.listing_generations
  for delete
  using (auth.uid() = user_id);
