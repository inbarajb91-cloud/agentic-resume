-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  full_name text,
  linkedin_url text,
  portfolio_url text,
  phone_masked boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- EXPERIENCE VAULT
create type experience_type as enum ('work', 'education', 'project', 'skill');

create table experience_vault (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  type experience_type not null,
  title text not null, -- Job Title, Degree, Project Name
  organization text, -- Company, University
  start_date date,
  end_date date,
  description_raw text, -- Original content
  source_file text, -- Filename of uploaded resume if applicable
  metadata jsonb default '{}'::jsonb, -- specialized tags, location, etc.
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- TAILORED RESUMES
create table tailored_resumes (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  job_title_target text not null,
  job_description_input text not null,
  slug text unique not null,
  content jsonb not null, -- The AI generated structure
  match_score integer,
  theme text default 'executive',
  is_public boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ANALYTICS
create type event_type as enum ('view', 'download_pdf', 'contact_reveal');

create table analytics (
  id uuid default uuid_generate_v4() primary key,
  resume_id uuid references tailored_resumes(id) on delete cascade not null,
  event_type event_type not null,
  viewer_location text,
  duration_seconds integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS POLICIES (Basic)
alter table profiles enable row level security;
alter table experience_vault enable row level security;
alter table tailored_resumes enable row level security;
alter table analytics enable row level security;

-- Policies for Profiles
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Policies for Experience Vault
create policy "Users can manage own vault" on experience_vault for all using (auth.uid() = user_id);

-- Policies for Tailored Resumes
create policy "Users can manage own resumes" on tailored_resumes for all using (auth.uid() = user_id);
create policy "Public can view public resumes" on tailored_resumes for select using (is_public = true);

-- Policies for Analytics
create policy "Users can view analytics for their resumes" on analytics for select using (
  exists (select 1 from tailored_resumes where id = analytics.resume_id and user_id = auth.uid())
);
create policy "Public can insert analytics" on analytics for insert with check (true);
