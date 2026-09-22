# Lead extraction

Извлеки данные из заявки. Верни только валидный JSON без Markdown.

```json
{
  "service": "string | null",
  "budget": "number | null",
  "currency": "BYN | USD | EUR | null",
  "city": "string | null",
  "deadline": "string | null",
  "priority": "high | medium | low",
  "summary": "string",
  "next_action": "string"
}
```

Правила:
- Не выдумывай факты: для неизвестного используй `null`.
- `high`, если есть конкретный бюджет и ближайший срок либо клиент просит срочно.
- `summary` — одно короткое предложение на русском.
- `next_action` — практическое действие менеджера.
