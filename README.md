# Lead Automation Lab

Учебный проект: автоматизированная обработка заявок на ремонт квартир.

Поток: `Telegram / форма → n8n → AI → Google Sheets → менеджер → follow-up`.

## Быстрый старт

1. Создайте Google-таблицу по инструкции `docs/google-sheets-setup.md` и шаблонам из `sheets/`.
2. В n8n создайте credentials, ориентируясь на `n8n/credentials.example/README.md`.
3. Импортируйте и запустите `n8n/workflows/01-intake-foundation.json` по инструкции в `n8n/workflows/README.md`.
4. Вставьте prompt из `prompts/lead-extract.md` в AI-узел Gemini.
5. Прогоните примеры из `tests/fixtures/`.

AI-узел обязан возвращать единый JSON. Поэтому Gemini позже заменяется на OpenAI в одном месте, без переделки интеграций.
