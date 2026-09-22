# Lead Automation Lab

Учебный проект: автоматизированная обработка заявок на ремонт квартир.

Поток: `Telegram / форма → n8n → AI → Google Sheets → менеджер → follow-up`.

## Быстрый старт

1. Создайте Google-таблицу по шаблону `sheets/schema.md`.
2. В n8n создайте credentials, ориентируясь на `n8n/credentials.example/README.md`.
3. Соберите первый workflow из `docs/workflow-spec.md`.
4. Вставьте prompt из `prompts/lead-extract.md` в AI-узел Gemini.
5. Прогоните примеры из `tests/fixtures/`.

AI-узел обязан возвращать единый JSON. Поэтому Gemini позже заменяется на OpenAI в одном месте, без переделки интеграций.
