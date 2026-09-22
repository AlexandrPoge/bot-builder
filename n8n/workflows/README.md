# n8n workflows

## Первый запуск

1. Откройте n8n → **Workflows** → **Import from File**.
2. Выберите `01-intake-foundation.json`.
3. Для ручной проверки нажмите **Execute Workflow**; для Telegram включите workflow (`Active`).
4. В узле `Normalize lead` убедитесь, что появились: `lead_id`, `created_at`, `normalized_text`, `message_hash` и `status: new`.

В workflow есть два входа: `Demo lead` для ручной проверки и `Telegram lead webhook` для бота. Webhook принимает `POST /webhook/telegram-lead`.

## Запись без дублей

После `Normalize lead` подключите узел **Append or update row in sheet** по инструкции в `docs/google-sheets-setup.md`. Он сопоставляет строку по `message_hash` и использует автоматическое сопоставление одноимённых полей. Повтор одного и того же обращения обновляет найденную строку, а не создаёт новую.

Не включайте workflow (`Active`) до подключения реального источника заявок.

## Следующий учебный этап

Экспортируйте обновлённый workflow из n8n и замените этим экспортом файл `01-intake-foundation.json` — так в Git всегда будет проверенная n8n-версия, а не догадка о версии узла. Не включайте в экспорт credentials или секреты.

## Локальный Telegram вход

В текущем локальном workflow добавлен `Webhook` с методом `POST` и путём `telegram-lead`. Локальный polling-бот из `apps/telegram-bot` передаёт в него `source`, `contact` и `message`. Webhook соединён с `Normalize lead`, поэтому далее используется тот же контур дедупликации и записи в Google Sheets.
