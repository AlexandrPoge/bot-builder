# n8n workflows

## Первый запуск

1. Откройте n8n → **Workflows** → **Import from File**.
2. Выберите `01-intake-foundation.json`.
3. Нажмите **Execute Workflow**.
4. В узле `Normalize lead` убедитесь, что появились: `lead_id`, `created_at`, `normalized_text`, `message_hash` и `status: new`.

Пока это локальный учебный сценарий: заявка создаётся в узле `Demo lead`. Следующий этап заменит его на Telegram Trigger или Webhook.

## Запись без дублей

В локальном n8n после `Normalize lead` добавлен узел **Append or update row in sheet**. Он сопоставляет строку по `message_hash` и использует автоматическое сопоставление одноимённых полей. Повтор одного и того же обращения обновляет найденную строку, а не создаёт новую.

Не включайте workflow (`Active`) до подключения реального источника заявок.

## Следующий учебный этап

Экспортируйте обновлённый workflow из n8n и замените этим экспортом файл `01-intake-foundation.json` — так в Git всегда будет проверенная n8n-версия, а не догадка о версии узла. Не включайте в экспорт credentials или секреты.
