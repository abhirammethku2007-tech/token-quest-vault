-- ============================================================
-- CertVault — Supabase PostgreSQL Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ─── Enums ───────────────────────────────────────────────────
create type role as enum ('student', 'management', 'admin');

create type certificate_type as enum (
  'Bonafide',
  'Study Certificate',
  'Fee Receipt',
  'Fee Due Certificate',
  'No Fee Due Certificate'
);

create type request_status as enum (
  'Pending',
  'Under Review',
  'Approved',
  'Rejected'
);

create type key_algorithm as enum ('Ed25519', 'RSA-2048');
create type key_status    as enum ('Active', 'Rotated', 'Revoked');

-- ─── Profiles ────────────────────────────────────────────────
-- Extends auth.users with app-specific fields
create table profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  name         text        not null,
  email        text        not null unique,
  role         role        not null default 'student',
  department   text,                        -- students only
  roll_number  text,                        -- students only
  designation  text,                        -- management / admin only
  created_at   timestamptz not null default now()
);

-- Auto-create a profile row when a new auth user signs up
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ─── Token Sequence ───────────────────────────────────────────
-- Concurrent-safe counter for certificate token numbers
create sequence cert_token_seq start 1;

create or replace function next_token_seq()
returns bigint language sql security definer as $$
  select nextval('cert_token_seq');
$$;

-- ─── Certificate Requests ─────────────────────────────────────
create table cert_requests (
  id              uuid primary key default gen_random_uuid(),
  token           text           not null unique,
  student_id      uuid           not null references profiles(id),
  student_name    text           not null,
  roll_number     text           not null,
  department      text           not null,
  type            certificate_type not null,
  reason          text,
  status          request_status not null default 'Pending',
  created_at      timestamptz    not null default now(),
  updated_at      timestamptz    not null default now(),
  remarks         text,
  signature_id    text,
  certificate_url text
);

-- Auto-update updated_at on row change
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger cert_requests_updated_at
  before update on cert_requests
  for each row execute procedure set_updated_at();

-- Indexes for common queries
create index idx_cert_requests_student_id on cert_requests(student_id);
create index idx_cert_requests_status     on cert_requests(status);
create index idx_cert_requests_created_at on cert_requests(created_at desc);

-- ─── Audit Logs ───────────────────────────────────────────────
create table audit_logs (
  id          uuid primary key default gen_random_uuid(),
  timestamp   timestamptz not null default now(),
  actor_id    uuid        not null references profiles(id),
  actor_name  text        not null,
  actor_role  role        not null,
  action      text        not null,   -- e.g. "Approved Request"
  target      text        not null,   -- e.g. token or email
  details     text
);

create index idx_audit_logs_timestamp on audit_logs(timestamp desc);
create index idx_audit_logs_actor_id  on audit_logs(actor_id);

-- ─── Signature Keys ───────────────────────────────────────────
create table signature_keys (
  id          uuid primary key default gen_random_uuid(),
  label       text          not null,
  algorithm   key_algorithm not null,
  status      key_status    not null default 'Active',
  created_at  timestamptz   not null default now(),
  rotated_at  timestamptz,
  created_by  uuid          not null references profiles(id)
);

create index idx_signature_keys_status on signature_keys(status);

-- ─── Row Level Security ───────────────────────────────────────
alter table profiles       enable row level security;
alter table cert_requests  enable row level security;
alter table audit_logs     enable row level security;
alter table signature_keys enable row level security;

-- profiles: users can read their own; management/admin can read all
create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Management and admin can view all profiles"
  on profiles for select
  using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid()
      and p.role in ('management', 'admin')
    )
  );

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- cert_requests: students see own; management/admin see all
create policy "Students can view own requests"
  on cert_requests for select
  using (student_id = auth.uid());

create policy "Students can create requests"
  on cert_requests for insert
  with check (student_id = auth.uid());

create policy "Management and admin can view all requests"
  on cert_requests for select
  using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid()
      and p.role in ('management', 'admin')
    )
  );

create policy "Management can update requests"
  on cert_requests for update
  using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid()
      and p.role in ('management', 'admin')
    )
  );

-- audit_logs: admin can read all; management/system can insert
create policy "Admin can view audit logs"
  on audit_logs for select
  using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid()
      and p.role = 'admin'
    )
  );

create policy "Management and admin can insert audit logs"
  on audit_logs for insert
  with check (
    exists (
      select 1 from profiles p
      where p.id = auth.uid()
      and p.role in ('management', 'admin')
    )
  );

-- signature_keys: admin only
create policy "Admin can manage signature keys"
  on signature_keys for all
  using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid()
      and p.role = 'admin'
    )
  );

-- ─── Enable Realtime ──────────────────────────────────────────
-- Run in Supabase Dashboard → Database → Replication
-- Or uncomment these if using CLI:
-- alter publication supabase_realtime add table cert_requests;
-- alter publication supabase_realtime add table audit_logs;
-- alter publication supabase_realtime add table signature_keys;
