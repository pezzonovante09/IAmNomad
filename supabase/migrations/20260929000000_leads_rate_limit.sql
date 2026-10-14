-- Защита от спама: ограничение частоты заявок.
-- С одного IP — не больше 5 заявок за 10 минут, всего — не больше 100 в час.
-- IP не хранится: только его хеш с солью (для подсчёта).

alter table public.leads add column ip_hash text;
comment on column public.leads.ip_hash is 'Хеш IP отправителя (для ограничения частоты), сам IP не хранится';
create index leads_ip_hash_created_at_idx on public.leads (ip_hash, created_at desc);

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create or replace function private.leads_rate_limit()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  headers json := nullif(current_setting('request.headers', true), '')::json;
  ip text := coalesce(
    headers ->> 'cf-connecting-ip',
    nullif(trim(split_part(headers ->> 'x-forwarded-for', ',', 1)), '')
  );
  recent int;
begin
  new.ip_hash := case when ip is null then null else md5('iamnomad:' || ip) end;

  if new.ip_hash is not null then
    select count(*) into recent
    from public.leads
    where ip_hash = new.ip_hash and created_at > now() - interval '10 minutes';
    if recent >= 5 then
      raise exception 'rate_limited: too many leads from this address' using errcode = 'P0001';
    end if;
  end if;

  select count(*) into recent
  from public.leads
  where created_at > now() - interval '1 hour';
  if recent >= 100 then
    raise exception 'rate_limited: too many leads' using errcode = 'P0001';
  end if;

  return new;
end;
$$;

revoke all on function private.leads_rate_limit() from public, anon, authenticated;

create trigger leads_rate_limit
  before insert on public.leads
  for each row execute function private.leads_rate_limit();

-- Для еженедельного «пинга» (.github/workflows/supabase-keepalive.yml),
-- чтобы бесплатный проект не засыпал.
create or replace function public.keepalive()
returns text
language sql
stable
set search_path = ''
as $$ select 'ok'::text $$;

revoke all on function public.keepalive() from public;
grant execute on function public.keepalive() to anon, authenticated;
