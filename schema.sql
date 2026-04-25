-- Create the sessions table
create table sessions (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  participants jsonb not null,
  steps jsonb not null,
  verdict jsonb not null,
  session_created_at bigint -- To keep your existing Date.now() values
);

-- Enable Row Level Security (RLS)
alter table sessions enable row level security;

-- Allow anyone to insert (Public Insert)
create policy "Enable insert for all users" on sessions for insert with check (true);

-- Allow anyone to read (Public Select)
create policy "Enable read access for all users" on sessions for select using (true);