-- Усиление базы по итогам аудита от 5 ноября 2026.
-- Файл подготовлен, но в проекте iamnomad НЕ применён: применять только после отдельного решения владельца.
-- Удаляет токен Telegram-бота из Vault: это необратимо, новый токен придётся выпускать в BotFather.

-- 1. Telegram не используется: убираем триггер, таблицу получателей, токен и pg_net.
-- Вместе с pg_net исчезают и лишние права anon и authenticated на схему net.
drop trigger if exists leads_notify_telegram on public.leads;
drop function if exists private.leads_notify_telegram();
drop function if exists private.html_escape(text);
drop table if exists private.telegram_recipients;
delete from vault.secrets where name = 'telegram_bot_token';
drop extension if exists pg_net;

-- 2. Отпечаток IP: HMAC с секретом вместо md5 с открытой солью, IPv6 считается по сети /64,
-- старые отпечатки стираются через сутки. Мягкий общий лимит: сверх 100 заявок в час новая заявка
-- сохраняется со статусом spam, а настоящий клиент не получает отказ. Жёсткий потолок 300 в час.
create extension if not exists pgcrypto with schema extensions;
select vault.create_secret(encode(extensions.gen_random_bytes(32), 'hex'), 'ip_hash_secret', 'Секрет для отпечатка IP в заявках');

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
  secret text;
  recent int;
begin
  update public.leads
  set ip_hash = null
  where ip_hash is not null and created_at < now() - interval '1 day';

  if ip is not null then
    begin
      if position(':' in ip) > 0 then
        ip := host(network(set_masklen(ip::inet, 64)));
      end if;
    exception when others then
      null; -- необычный адрес считаем как есть
    end;

    select decrypted_secret into secret from vault.decrypted_secrets where name = 'ip_hash_secret' limit 1;
    new.ip_hash := encode(extensions.hmac(ip, secret, 'sha256'), 'hex');
  end if;

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
  if recent >= 300 then
    raise exception 'rate_limited: too many leads' using errcode = 'P0001';
  end if;
  if recent >= 100 then
    new.status := 'spam';
  end if;

  return new;
end;
$$;

revoke all on function private.leads_rate_limit() from public, anon, authenticated;

-- Статус задаёт только триггер: у публичного ключа нет права на колонку status.
drop policy "site can submit new leads" on public.leads;
create policy "site can submit new leads"
  on public.leads for insert
  to anon, authenticated
  with check (status in ('new', 'spam') and notes is null);

alter table public.leads drop constraint leads_data_check;
alter table public.leads add constraint leads_data_check check (pg_column_size(data) <= 8000);

-- 3. Имя и фото отзыва: из данных Google в auth.identities, а не из токена, где поле user_metadata
-- пользователь меняет сам. Фото принимается только с адреса Google.
create or replace function private.reviews_prepare()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  profile jsonb;
  full_name text;
  photo text;
  parts text[];
  recent int;
begin
  select identity_data into profile
  from auth.identities
  where user_id = new.user_id and provider = 'google'
  limit 1;

  if profile is null then
    raise exception 'google_required: a review needs a Google account' using errcode = 'P0001';
  end if;

  full_name := nullif(btrim(coalesce(profile ->> 'full_name', profile ->> 'name', '')), '');
  if full_name is not null then
    parts := regexp_split_to_array(full_name, '\s+');
    new.name := left(
      case when array_length(parts, 1) > 1
        then parts[1] || ' ' || upper(left(parts[array_length(parts, 1)], 1)) || '.'
        else parts[1]
      end,
      120);
  else
    new.name := 'Гость';
  end if;

  photo := coalesce(profile ->> 'avatar_url', profile ->> 'picture');
  new.avatar_url := case
    when photo like 'https://lh3.googleusercontent.com/%' then left(photo, 500)
    else null
  end;

  select count(*) into recent from public.reviews where created_at > now() - interval '1 hour';
  if recent >= 30 then
    raise exception 'rate_limited: too many reviews' using errcode = 'P0001';
  end if;

  return new;
end;
$$;

revoke all on function private.reviews_prepare() from public, anon, authenticated;

-- 4. Новые таблицы и функции в public больше не открываются публичным ролям автоматически.
alter default privileges for role postgres in schema public revoke all on tables from anon, authenticated;
alter default privileges for role postgres in schema public revoke all on functions from anon, authenticated;
alter default privileges for role postgres in schema public revoke all on sequences from anon, authenticated;
