-- Create custom auth tables
create table if not exists public.auth_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text not null,
  full_name text,
  is_verified boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.email_verification_tokens (
  token text primary key,
  user_id uuid not null references public.auth_users(id) on delete cascade,
  expires_at timestamptz not null,
  used boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists email_verification_tokens_user_id_idx on public.email_verification_tokens(user_id);

grant select, insert, update, delete on public.auth_users to anon, authenticated, service_role;
grant select, insert, update, delete on public.email_verification_tokens to anon, authenticated, service_role;


