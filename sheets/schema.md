# Google Sheets schema

Создайте три листа.

## Leads

`lead_id, created_at, source, contact, raw_text, service, budget, currency, city, deadline, priority, summary, next_action, status, manager, first_response_at, normalized_text, message_hash`

`message_hash` — служебный ключ дедупликации. Он строится из нормализованного текста и контакта, поэтому одинаковое обращение одного клиента не создаёт вторую строку.

## Заявки менеджера

Отдельный лист-витрина для менеджера. Он читает данные из технического листа `Leads`/`Лист1` и показывает только рабочие поля в таком порядке: статус, приоритет, следующее действие, клиент, услуга, город, бюджет, срок, кратко, получено, менеджер, ID. Менеджер работает в этой витрине, а n8n продолжает записывать в технический лист.

Статусы: `new`, `needs_review`, `in_progress`, `qualified`, `won`, `lost`.

## Events

`event_id, created_at, lead_id, event_type, result, error_message`

## Metrics

`week_start, new_leads, qualified_leads, won_leads, avg_first_response_minutes, lost_reason`
