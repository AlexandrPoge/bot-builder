# Lead Automation Lab

Учебный проект: автоматизированная обработка заявок на ремонт квартир.

Поток: `Telegram bot → локальный n8n → AI → Google Sheets → менеджер → follow-up`.

## Быстрый старт

1. Создайте Google-таблицу по инструкции `docs/google-sheets-setup.md` и шаблонам из `sheets/`.
2. В n8n создайте credentials, ориентируясь на `n8n/credentials.example/README.md`.
3. Импортируйте и запустите `n8n/workflows/01-intake-foundation.json` по инструкции в `n8n/workflows/README.md`.
4. Вставьте prompt из `prompts/lead-extract.md` в AI-узел Gemini.
5. Прогоните примеры из `tests/fixtures/`.

Для локальной Telegram demo-версии используйте [инструкцию бота](apps/telegram-bot/README.md). Токен Telegram хранится только в локальном `.env`, который не коммитится.

AI-узел обязан возвращать единый JSON. Поэтому Gemini позже заменяется на OpenAI в одном месте, без переделки интеграций.

Для защиты от повторов Google Sheets сопоставляет входящую заявку по `message_hash`: одинаковое сообщение от того же контакта обновляет найденную строку, а не добавляет новую.
