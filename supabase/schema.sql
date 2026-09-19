-- School Management System schema for Supabase
-- This project uses Supabase Auth (auth.users) and custom public tables.

create type public.app_role as enum ('admin', 'teacher', 'student', 'accountant', 'library');

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text unique not null,
  role public.app_role not null,
  phone text,
  department text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create table if not exists public.classes (
  id bigserial primary key,
  name text not null unique,
  teacher_id bigint,
  room text,
  student_count integer default 0,
  created_at timestamptz default now() not null
);

create table if not exists public.students (
  id bigserial primary key,
  profile_id uuid unique not null references public.profiles(id) on delete cascade,
  student_code text unique not null,
  full_name text not null,
  gender text,
  dob date,
  class_id bigint references public.classes(id),
  guardian_name text,
  guardian_phone text,
  status text default 'Active',
  created_at timestamptz default now() not null
);

create table if not exists public.staff (
  id bigserial primary key,
  profile_id uuid unique not null references public.profiles(id) on delete cascade,
  staff_code text unique not null,
  full_name text not null,
  role_title text,
  department text,
  class_id bigint references public.classes(id),
  status text default 'Active',
  phone text,
  salary numeric(12,2) default 0,
  created_at timestamptz default now() not null
);

create table if not exists public.subjects (
  id bigserial primary key,
  name text not null unique,
  created_at timestamptz default now() not null
);

create table if not exists public.terms (
  id bigserial primary key,
  name text not null unique,
  start_date date,
  end_date date
);

create table if not exists public.grades (
  id bigserial primary key,
  student_id bigint not null references public.students(id) on delete cascade,
  subject_id bigint not null references public.subjects(id),
  term_id bigint not null references public.terms(id),
  score integer not null check (score >= 0 and score <= 100),
  grade text,
  teacher_id bigint references public.staff(id),
  status text default 'published',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create table if not exists public.grade_submissions (
  id bigserial primary key,
  student_id bigint not null references public.students(id) on delete cascade,
  subject_id bigint not null references public.subjects(id),
  term_id bigint not null references public.terms(id),
  score integer not null check (score >= 0 and score <= 100),
  grade text,
  teacher_id bigint not null references public.staff(id),
  submitted_at timestamptz default now() not null,
  approved_by uuid references auth.users(id),
  approved_at timestamptz,
  status text default 'pending' check (status in ('pending', 'approved', 'rejected'))
);

create table if not exists public.attendance (
  id bigserial primary key,
  student_id bigint not null references public.students(id) on delete cascade,
  attendance_date date not null,
  status text not null check (status in ('Present', 'Absent', 'Late')),
  remarks text,
  created_at timestamptz default now() not null,
  unique (student_id, attendance_date)
);

create table if not exists public.fees (
  id bigserial primary key,
  student_id bigint not null references public.students(id) on delete cascade,
  class_id bigint references public.classes(id),
  term_id bigint not null references public.terms(id),
  fee_type text not null default 'Tuition',
  amount numeric(12,2) not null,
  paid_amount numeric(12,2) default 0,
  status text default 'Unpaid' check (status in ('Paid', 'Partial', 'Unpaid')),
  due_date date,
  created_at timestamptz default now() not null
);

create table if not exists public.fee_bands (
  id bigserial primary key,
  code text unique not null check (code in ('nursery', 'kindergarten', 'grade_1_6', 'grade_7_9')),
  name text not null,
  boarding_enabled boolean not null default true
);

create table if not exists public.fee_structure_items (
  id bigserial primary key,
  fee_band_id bigint not null references public.fee_bands(id) on delete cascade,
  term_id bigint not null references public.terms(id) on delete cascade,
  fee_type text not null check (fee_type in ('Tuition', 'Sports', 'Library', 'Lab', 'Exam', 'Uniform', 'Boarding')),
  amount numeric(12,2) not null check (amount >= 0),
  unique (fee_band_id, term_id, fee_type)
);

create table if not exists public.fee_payments (
  id bigserial primary key,
  fee_id bigint not null references public.fees(id) on delete cascade,
  amount numeric(12,2) not null,
  payment_date timestamptz default now() not null,
  payment_method text,
  reference_code text
);

create table if not exists public.library_books (
  id bigserial primary key,
  title text not null,
  author text,
  isbn text unique,
  copies integer not null default 0,
  available_copies integer not null default 0,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  check (available_copies >= 0 and available_copies <= copies)
);

create table if not exists public.book_loans (
  id bigserial primary key,
  book_id bigint not null references public.library_books(id) on delete cascade,
  student_id bigint references public.students(id),
  staff_id bigint references public.staff(id),
  issued_by uuid not null references auth.users(id),
  borrow_date date not null,
  due_date date,
  return_date date,
  returned_by uuid references auth.users(id),
  status text default 'borrowed' check (status in ('borrowed', 'returned', 'overdue'))
);

create table if not exists public.timetable (
  id bigserial primary key,
  class_id bigint not null references public.classes(id) on delete cascade,
  day text not null,
  period_name text not null,
  subject_id bigint not null references public.subjects(id),
  teacher_id bigint references public.staff(id),
  unique (class_id, day, period_name)
);

create table if not exists public.announcements (
  id bigserial primary key,
  title text not null,
  body text not null,
  type text default 'Academic',
  created_by uuid references auth.users(id),
  created_at timestamptz default now() not null
);

create table if not exists public.communication_messages (
  id bigserial primary key,
  sender_id uuid not null references auth.users(id),
  receiver_id uuid references auth.users(id),
  class_id bigint references public.classes(id),
  message text not null,
  created_at timestamptz default now() not null
);

create table if not exists public.reports (
  id bigserial primary key,
  report_type text not null,
  generated_by uuid references auth.users(id),
  generated_at timestamptz default now() not null,
  details jsonb
);

create table if not exists public.school_settings (
  id bigserial primary key,
  setting_key text unique not null,
  setting_value text,
  updated_at timestamptz default now() not null
);

-- Recommended basic RLS setup for a Supabase project
alter table public.profiles enable row level security;
alter table public.students enable row level security;
alter table public.staff enable row level security;
alter table public.classes enable row level security;
alter table public.grades enable row level security;
alter table public.fees enable row level security;
alter table public.library_books enable row level security;
alter table public.announcements enable row level security;

create policy "profiles_are_viewable_by_owners" on public.profiles
for select using (auth.uid() = id);

create policy "profiles_are_updatable_by_owners" on public.profiles
for update using (auth.uid() = id);

create policy "students_are_readable_by_authenticated_users" on public.students
for select using (auth.role() = 'authenticated');

create policy "staff_are_readable_by_authenticated_users" on public.staff
for select using (auth.role() = 'authenticated');

create policy "classes_are_readable_by_authenticated_users" on public.classes
for select using (auth.role() = 'authenticated');

create policy "announcements_are_readable_by_authenticated_users" on public.announcements
for select using (auth.role() = 'authenticated');
