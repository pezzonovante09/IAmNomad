-- Отзывы посетителей: вход через Google (Supabase Auth), показ только после одобрения.
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid not null default auth.uid() unique references auth.users (id) on delete cascade,
  name text not null default '' check (char_length(name) <= 120),
  avatar_url text check (char_length(avatar_url) <= 500),
  rating int not null check (rating between 1 and 5),
  text text not null check (char_length(text) between 10 and 1500),
  lang text not null default 'ru' check (lang in ('ru', 'en')),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  notes text
);

comment on table public.reviews is 'Отзывы с сайта. status: pending — ждёт проверки, approved — показывается на сайте, rejected — отклонён. Чтобы опубликовать отзыв, поменяйте status на approved.';
comment on column public.reviews.user_id is 'Аккаунт Google (Supabase Auth); один отзыв на человека';
comment on column public.reviews.notes is 'Заметки модератора';

create index reviews_status_created_at_idx on public.reviews (status, created_at desc);

alter table public.reviews enable row level security;

revoke all on public.reviews from anon, authenticated;
-- Читать можно только безопасные колонки одобренных отзывов (без user_id и заметок).
grant select (id, created_at, name, avatar_url, rating, text, lang) on public.reviews to anon, authenticated;
-- Добавить можно только свой отзыв; user_id, name и avatar_url подставляются на сервере.
grant insert (name, avatar_url, rating, text, lang) on public.reviews to authenticated;

create policy "approved reviews are public"
  on public.reviews for select
  to anon, authenticated
  using (status = 'approved');

create policy "signed-in users can submit their own review"
  on public.reviews for insert
  to authenticated
  with check (user_id = auth.uid() and status = 'pending');

-- Имя и фото берутся из токена Google, а не из запроса: подделать их нельзя.
-- Имя сокращается до «Имя Ф.». Плюс общий лимит: не больше 30 отзывов в час.
create or replace function private.reviews_prepare()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  claims jsonb := coalesce(nullif(current_setting('request.jwt.claims', true), '')::jsonb, '{}'::jsonb);
  meta jsonb := coalesce(claims -> 'user_metadata', '{}'::jsonb);
  full_name text := nullif(btrim(coalesce(meta ->> 'full_name', meta ->> 'name', '')), '');
  parts text[];
  recent int;
begin
  if full_name is not null then
    parts := regexp_split_to_array(full_name, '\s+');
    new.name := left(
      case when array_length(parts, 1) > 1
        then parts[1] || ' ' || upper(left(parts[array_length(parts, 1)], 1)) || '.'
        else parts[1]
      end,
      120);
  else
    new.name := left(btrim(new.name), 120);
  end if;

  new.avatar_url := case
    when coalesce(meta ->> 'avatar_url', meta ->> 'picture') like 'https://%'
      then left(coalesce(meta ->> 'avatar_url', meta ->> 'picture'), 500)
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

create trigger reviews_prepare
  before insert on public.reviews
  for each row execute function private.reviews_prepare();
