create table if not exists analytics (
  id uuid default gen_random_uuid() primary key,
  resume_id uuid references tailored_resumes(id) on delete cascade not null,
  event_type text not null, -- 'view', 'download', 'heartbeat', 'reveal_contact'
  viewer_location text,
  duration_seconds integer default 0,
  meta jsonb, -- for any extra data
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS
alter table analytics enable row level security;

-- Candidates can view analytics for their own resumes
create policy "Users can view analytics for their resumes"
  on analytics for select
  using (
    exists (
      select 1 from tailored_resumes
      where tailored_resumes.id = analytics.resume_id
      and tailored_resumes.user_id = auth.uid()
    )
  );

-- Public can insert analytics (anonymous recruiters)
create policy "Public can insert analytics"
  on analytics for insert
  with check (true);
