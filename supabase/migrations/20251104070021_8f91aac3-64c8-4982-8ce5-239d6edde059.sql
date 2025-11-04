-- Ensure profiles table exists
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'student',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Function to update updated_at
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql security definer set search_path = public;

-- Trigger for updated_at
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_profiles_updated_at'
  ) THEN
    CREATE TRIGGER trg_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- Recreate RLS policies (drop if exist first to avoid errors)
drop policy if exists "Profiles: users can view own" on public.profiles;
drop policy if exists "Profiles: users can update own" on public.profiles;
drop policy if exists "Profiles: users can insert own" on public.profiles;
drop policy if exists "Profiles: admins can view all" on public.profiles;

create policy "Profiles: users can view own" on public.profiles
for select using (auth.uid() = id);

create policy "Profiles: users can update own" on public.profiles
for update using (auth.uid() = id);

create policy "Profiles: users can insert own" on public.profiles
for insert with check (auth.uid() = id);

create policy "Profiles: admins can view all" on public.profiles
for select using (
  auth.uid() = id OR EXISTS (
    SELECT 1 FROM public.profiles me WHERE me.id = auth.uid() AND me.role = 'admin'
  )
);

-- Function to handle new user signups and insert into profiles
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', new.email), 'student')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

-- Create trigger on auth.users AFTER INSERT if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  END IF;
END $$;

-- Backfill profiles for existing users without a profile
insert into public.profiles (id, full_name, role)
select u.id,
       coalesce(u.raw_user_meta_data ->> 'full_name', u.email),
       'student'
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null;
