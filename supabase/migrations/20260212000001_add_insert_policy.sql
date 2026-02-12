-- Allow users to insert their own profile (Critical for "Self-Healing" missing profiles)
create policy "Users can insert own profile"
on profiles for insert
with check (auth.uid() = id);

-- Ensure users can update their own profile (Existing, but good to double check)
-- drop policy if exists "Users can update own profile" on profiles;
-- create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
