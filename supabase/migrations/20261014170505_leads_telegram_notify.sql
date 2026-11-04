-- Уведомления о новых заявках в Telegram.
-- Токен бота хранится в Vault (секрет 'telegram_bot_token'), получатели — private.telegram_recipients.
-- Эмодзи заданы кодами через chr(): new 127381, person 128100, phone 128222, mail 9993,
-- compass 129517, square 9643, speech 128172, globe 127760.
create or replace function private.leads_notify_telegram()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  token text;
  form_label text;
  extra text := '';
  msg text;
  rec record;
  k text;
  v text;
  labels constant jsonb := '{"company": "Компания", "contact": "Контактное лицо", "participants": "Участников", "dates": "Даты", "whatsapp": "WhatsApp", "date": "Дата", "guests": "Гостей", "event_type": "Тип события"}';
begin
  begin
    select decrypted_secret into token from vault.decrypted_secrets where name = 'telegram_bot_token' limit 1;
    if token is null or not exists (select 1 from private.telegram_recipients) then
      return new;
    end if;

    form_label := case new.form
      when 'lead' then 'Заявка с главной'
      when 'contact' then 'Заявка (контакты / туры)'
      when 'corporate' then 'Корпоративная заявка (MICE)'
      when 'show' then 'Бронирование I AM NOMAD SHOW'
      else new.form
    end;

    for k, v in select key, value from jsonb_each_text(new.data) loop
      continue when v is null or v = '' or k = 'contact';
      extra := extra || E'\n' || chr(9643) || ' ' || private.html_escape(coalesce(labels ->> k, k)) || ': ' || private.html_escape(left(v, 300));
    end loop;

    msg := chr(127381) || ' <b>' || private.html_escape(form_label) || '</b>'
      || E'\n\n' || chr(128100) || ' ' || private.html_escape(coalesce(new.name, '-'))
      || case when new.phone is not null then E'\n' || chr(128222) || ' ' || private.html_escape(new.phone) else '' end
      || case when new.email is not null then E'\n' || chr(9993) || ' ' || private.html_escape(new.email) else '' end
      || case when new.tour is not null then E'\n' || chr(129517) || ' ' || private.html_escape(new.tour) else '' end
      || extra
      || case when new.message is not null then E'\n\n' || chr(128172) || ' ' || private.html_escape(left(new.message, 1500)) else '' end
      || E'\n\n' || chr(127760) || ' ' || private.html_escape(coalesce(new.page, '')) || ' / ' || upper(coalesce(new.lang, ''))
      || E'\n<a href="https://supabase.com/dashboard/project/yqamuqihlrccpbcgzqsc/editor">Открыть заявки в Supabase</a>';

    for rec in select chat_id from private.telegram_recipients loop
      perform net.http_post(
        url := 'https://api.telegram.org/bot' || token || '/sendMessage',
        body := jsonb_build_object('chat_id', rec.chat_id, 'text', msg, 'parse_mode', 'HTML', 'disable_web_page_preview', true),
        headers := '{"Content-Type": "application/json"}'::jsonb,
        timeout_milliseconds := 20000
      );
    end loop;
  exception when others then
    -- Уведомление не должно мешать сохранению заявки
    raise warning 'leads_notify_telegram failed: %', sqlerrm;
  end;
  return new;
end;
$$;

revoke all on function private.leads_notify_telegram() from public, anon, authenticated;

-- В журнале миграций этой строки нет (триггер создан отдельно), здесь она для полноты.
create trigger leads_notify_telegram
  after insert on public.leads
  for each row execute function private.leads_notify_telegram();
