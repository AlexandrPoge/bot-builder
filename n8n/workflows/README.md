# n8n workflows

## Первый запуск

1. Откройте n8n → **Workflows** → **Import from File**.
2. Выберите `01-intake-foundation.json`.
3. Нажмите **Execute Workflow**.
4. В узле `Normalize lead` убедитесь, что появились: `lead_id`, `created_at`, `normalized_text`, `message_hash` и `status: new`.

Пока это локальный учебный сценарий: заявка создаётся в узле `Demo lead`. Следующий этап заменит его на Telegram Trigger или Webhook и добавит запись в Google Sheets.

Не включайте workflow (`Active`) до подключения реального источника заявок.

## Следующий учебный этап

Подключите таблицу по `docs/google-sheets-setup.md`, затем вручную добавьте после `Normalize lead` узел Google Sheets с действием **Append Row**. Экспортируйте обновлённый workflow из n8n и замените этим экспортом файл `01-intake-foundation.json` — так в Git всегда будет проверенная n8n-версия, а не догадка о версии узла.
