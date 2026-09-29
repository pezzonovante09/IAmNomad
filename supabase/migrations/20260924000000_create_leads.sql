-- Заявки с сайта iamnomadkg.com (применено в проекте iamnomad через Supabase MCP)
create table public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  form text not null check (form in ('lead', 'contact', 'corporate', 'show')),
  name text check (char_length(name) <= 200),
  email text check (char_length(email) <= 200),
  phone text check (char_length(phone) <= 100),
  tour text check (char_length(tour) <= 300),
  message text check (char_length(message) <= 5000),
  data jsonb not null default '{}'::jsonb check (pg_column_size(data) <= 20000),
  page text check (char_length(page) <= 500),
  lang text check (lang in ('ru', 'en')),
  status text not null default 'new' check (status in ('new', 'in_progress', 'done', 'cancelled', 'spam')),
  notes text
);

comment on table public.leads is 'Заявки с сайта. status: new — новая, in_progress — в работе, done — закрыта, cancelled — отказ, spam — спам. notes — заметки менеджера.';
comment on column public.leads.form is 'Какая форма: lead — заявка на главной, contact — контакты/туры, corporate — MICE, show — I AM NOMAD SHOW';
comment on column public.leads.data is 'Остальные поля формы (компания, даты, гости, WhatsApp и т.д.)';
comment on column public.leads.page is 'Страница, с которой отправлена заявка';
comment on column public.leads.status is 'new / in_progress / done / cancelled / spam';
comment on column public.leads.notes is 'Заметки менеджера';

create index leads_created_at_idx on public.leads (created_at desc);
create index leads_status_idx on public.leads (status);

-- Сайт (публичный ключ) может только добавлять заявки — читать, менять и удалять нельзя.
alter table public.leads enable row level security;

revoke all on public.leads from anon, authenticated;
grant insert (form, name, email, phone, tour, message, data, page, lang) on public.leads to anon, authenticated;

create policy "site can submit new leads"
  on public.leads for insert
  to anon, authenticated
  with check (status = 'new' and notes is null);
