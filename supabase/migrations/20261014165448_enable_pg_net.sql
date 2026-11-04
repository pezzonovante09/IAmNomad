-- pg_net: база сама отправляет HTTP-запросы (уведомления о заявках в Telegram).
create extension if not exists pg_net with schema extensions;
