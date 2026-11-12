-- CRAS Acolhe | Schema inicial para ambiente institucional homologado.
-- Não execute em produção antes de aprovação jurídica, de segurança e do controlador.
-- Dados de cidadãos não são inseridos por este script.

create extension if not exists pgcrypto;

create type public.request_status as enum (
  'received', 'review', 'scheduled', 'referred', 'completed', 'cancelled'
);
create type public.cadunico_status as enum ('yes', 'no', 'unknown');

create table public.units (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  municipality text not null default 'Piripiri',
  state char(2) not null default 'PI',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.service_catalog (
  id text primary key,
  title text not null,
  description text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

insert into public.service_catalog (id, title, description) values
 ('food','Cesta básica e alimentação','Orientação sobre apoio alimentar e benefícios eventuais.'),
 ('funeral','Auxílio-funeral','Orientação sobre benefício eventual em situação de falecimento.'),
 ('travel','Passagem intermunicipal','Orientação sobre deslocamento conforme regras aplicáveis.'),
 ('elder','Carteira da Pessoa Idosa','Orientação sobre critérios e emissão.'),
 ('autism','Carteira de Identificação da Pessoa com TEA','Orientação sobre a CIPTEA.'),
 ('freepass','Passe Livre','Orientação sobre modalidades e critérios.'),
 ('cadunico','Cadastro Único','Orientação para inscrição ou atualização cadastral.'),
 ('other','Outro atendimento social','Acolhimento e orientação inicial.');

create table public.staff_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  unit_id uuid references public.units(id),
  role text not null check (role in ('attendant','coordinator','admin')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Minimização: não guardar CPF, NIS, laudos, narrativas de violência ou documentos neste MVP.
create table public.service_requests (
  id uuid primary key default gen_random_uuid(),
  protocol text not null unique,
  unit_id uuid references public.units(id),
  service_id text not null references public.service_catalog(id),
  applicant_name text not null check (char_length(applicant_name) between 2 and 120),
  contact_phone text,
  cadunico cadunico_status not null default 'unknown',
  status request_status not null default 'received',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id)
);

create table public.request_events (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.service_requests(id) on delete cascade,
  actor_id uuid references auth.users(id),
  event_type text not null check (char_length(event_type) between 2 and 60),
  description text check (description is null or char_length(description) <= 500),
  created_at timestamptz not null default now()
);

create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.service_requests(id) on delete cascade,
  scheduled_at timestamptz not null,
  status text not null default 'scheduled' check (status in ('scheduled','cancelled','attended','missed')),
  created_at timestamptz not null default now()
);

create index service_requests_unit_created_idx on public.service_requests(unit_id, created_at desc);
create index service_requests_status_idx on public.service_requests(status);
create index request_events_request_created_idx on public.request_events(request_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
create trigger service_requests_updated_at
before update on public.service_requests
for each row execute function public.set_updated_at();

-- Função auxiliar: verifica vínculo ativo do servidor à unidade do registro.
create or replace function public.staff_can_access_unit(target_unit uuid)
returns boolean language sql stable security definer
set search_path = '' as $$
  select exists (
    select 1 from public.staff_profiles sp
    where sp.user_id = (select auth.uid())
      and sp.active = true
      and (sp.role = 'admin' or sp.unit_id = target_unit)
  );
$$;
revoke all on function public.staff_can_access_unit(uuid) from public;
grant execute on function public.staff_can_access_unit(uuid) to authenticated;

alter table public.units enable row level security;
alter table public.service_catalog enable row level security;
alter table public.staff_profiles enable row level security;
alter table public.service_requests enable row level security;
alter table public.request_events enable row level security;
alter table public.appointments enable row level security;

-- Catálogo e unidades ativas são informações não pessoais.
create policy "public can read active units" on public.units
for select to anon, authenticated using (active = true);
create policy "public can read active services" on public.service_catalog
for select to anon, authenticated using (active = true);

-- Servidor só visualiza o próprio perfil; administração deve ser feita por fluxo controlado.
create policy "staff can read own profile" on public.staff_profiles
for select to authenticated using (user_id = (select auth.uid()));

-- Nenhuma política anon de INSERT/SELECT/UPDATE/DELETE em solicitações.
-- A gravação pública, se aprovada para produção, deverá passar por Edge Function
-- com validação, rate limit, proteção anti-abuso e chave service_role somente no servidor.
create policy "staff read requests in assigned unit" on public.service_requests
for select to authenticated using (public.staff_can_access_unit(unit_id));
create policy "staff update requests in assigned unit" on public.service_requests
for update to authenticated
using (public.staff_can_access_unit(unit_id))
with check (public.staff_can_access_unit(unit_id));

create policy "staff read request events in assigned unit" on public.request_events
for select to authenticated using (
  exists (select 1 from public.service_requests r
          where r.id = request_id and public.staff_can_access_unit(r.unit_id))
);
create policy "staff add request events in assigned unit" on public.request_events
for insert to authenticated with check (
  actor_id = (select auth.uid()) and
  exists (select 1 from public.service_requests r
          where r.id = request_id and public.staff_can_access_unit(r.unit_id))
);

create policy "staff manage appointments in assigned unit" on public.appointments
for all to authenticated
using (exists (select 1 from public.service_requests r
               where r.id = request_id and public.staff_can_access_unit(r.unit_id)))
with check (exists (select 1 from public.service_requests r
                    where r.id = request_id and public.staff_can_access_unit(r.unit_id)));

-- Não conceder permissões amplas. RLS continua sendo a segunda camada de proteção.
revoke all on public.service_requests, public.request_events, public.appointments, public.staff_profiles from anon;
grant select on public.units, public.service_catalog to anon, authenticated;
grant select on public.staff_profiles to authenticated;
grant select on public.service_requests to authenticated;
revoke update on public.service_requests from authenticated;
grant update (status) on public.service_requests to authenticated;
grant select, insert on public.request_events to authenticated;
grant select, insert, update on public.appointments to authenticated;
