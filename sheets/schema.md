# Google Sheets schema

Создайте три листа.

## Leads

`lead_id, created_at, source, contact, raw_text, service, budget, currency, city, deadline, priority, summary, next_action, status, manager, first_response_at`

Статусы: `new`, `needs_review`, `in_progress`, `qualified`, `won`, `lost`.

## Events

`event_id, created_at, lead_id, event_type, result, error_message`

## Metrics

`week_start, new_leads, qualified_leads, won_leads, avg_first_response_minutes, lost_reason`
