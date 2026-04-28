-- ============================================================
-- CertVault — Seed Data
-- Run AFTER schema.sql
-- NOTE: Create auth users first via Supabase Dashboard →
--       Authentication → Users → Add User, then paste their
--       UUIDs below to update the profiles.
-- ============================================================

-- After creating users in Auth, update their profiles like this:
-- (Replace the UUIDs with the actual ones from your Auth dashboard)

/*
-- Example: set role for a student
update profiles
set
  role        = 'student',
  department  = 'CSE',
  roll_number = '21CSE011',
  name        = 'Aarav Sharma'
where email = '21cse011@mlrit.ac.in';

-- Example: set role for management
update profiles
set
  role        = 'management',
  designation = 'Registrar',
  name        = 'Neha Reddy'
where email = 'neha@mlrit.ac.in';

-- Example: set role for admin (Principal)
update profiles
set
  role        = 'admin',
  designation = 'Principal',
  name        = 'Dr. Ramesh Kumar'
where email = 'principal@mlrit.ac.in';
*/

-- Seed signature keys (run after creating the admin user)
/*
insert into signature_keys (label, algorithm, status, created_by)
values
  ('Primary Key',  'Ed25519',  'Active',  '<admin-uuid>'),
  ('Backup Key',   'RSA-2048', 'Rotated', '<admin-uuid>');
*/
