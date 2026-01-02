-- 1. Habilitar la extensión de UUID si no está activa
create extension if not exists "uuid-ossp";

-- 6. Tabla de Administradores
create table if not exists admins (
  id uuid default uuid_generate_v4() primary key,
  rut text unique not null,
  password text not null,
  created_at timestamp with time zone default now()
);

-- Insertar administrador por defecto
insert into admins (rut, password)
values ('25802881-3', 'HY2026')
on conflict (rut) do nothing;

-- 2. Tabla de Votaciones (Polls)
-- Se actualiza para incluir admin_id
create table if not exists polls (
  id uuid default uuid_generate_v4() primary key,
  admin_id uuid references admins(id),
  title text not null,
  type text not null,
  status text not null default 'DRAFT',
  start_time timestamp with time zone,
  end_time timestamp with time zone,
  max_voters integer default 0,
  total_votes integer default 0,
  hide_results boolean default false,
  allow_edit boolean default false,
  created_at timestamp with time zone default now()
);

-- 3. Tabla de Opciones (Options) - Para votos BOOLEAN y MULTIPLE
create table if not exists poll_options (
  id uuid default uuid_generate_v4() primary key,
  poll_id uuid references polls(id) on delete cascade,
  text text not null,
  votes integer default 0,
  color text,
  created_at timestamp with time zone default now()
);

-- 4. Tabla de Votos de Palabras (Word Votes) - Para WORDCLOUD
create table if not exists poll_word_votes (
  id uuid default uuid_generate_v4() primary key,
  poll_id uuid references polls(id) on delete cascade,
  text text not null,
  count integer default 1,
  created_at timestamp with time zone default now()
);

-- 5. Habilitar Realtime para estas tablas
-- Ejecutar esto en el SQL Editor de Supabase
alter publication supabase_realtime add table polls;
alter publication supabase_realtime add table poll_options;
alter publication supabase_realtime add table poll_word_votes;
