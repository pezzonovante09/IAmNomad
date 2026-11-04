create table if not exists private.telegram_recipients (
  chat_id bigint primary key,
  label text,
  created_at timestamptz not null default now()
);
comment on table private.telegram_recipients is 'Кому отправлять уведомления о заявках (chat_id из Telegram)';
revoke all on private.telegram_recipients from public, anon, authenticated;

create or replace function private.html_escape(s text)
returns text
language sql
immutable
set search_path = ''
as $$ select replace(replace(replace(coalesce(s, ''), '&', '&amp;'), '<', '&lt;'), '>', '&gt;') $$;

revoke all on function private.html_escape(text) from public, anon, authenticated;
