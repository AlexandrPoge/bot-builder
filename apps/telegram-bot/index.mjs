const token = process.env.TELEGRAM_BOT_TOKEN;
const webhookUrl = process.env.N8N_WEBHOOK_URL ?? 'http://localhost:5678/webhook/telegram-lead';

if (!token) {
  throw new Error('Set TELEGRAM_BOT_TOKEN before starting the bot.');
}

const telegramApi = `https://api.telegram.org/bot${token}`;
let offset = 0;

async function callTelegram(method, payload) {
  const response = await fetch(`${telegramApi}/${method}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const result = await response.json();
  if (!result.ok) throw new Error(`Telegram ${method} failed: ${result.description}`);
  return result.result;
}

async function submitLead(message) {
  const contact = message.from.username
    ? `@${message.from.username}`
    : `telegram:${message.from.id}`;

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      source: 'telegram',
      contact,
      message: message.text,
      telegram_chat_id: String(message.chat.id),
    }),
  });

  if (!response.ok) {
    throw new Error(`n8n webhook returned ${response.status}`);
  }
}

async function run() {
  console.log('Telegram bot is listening for messages.');

  while (true) {
    const updates = await callTelegram('getUpdates', {
      offset,
      timeout: 30,
      allowed_updates: ['message'],
    });

    for (const update of updates) {
      offset = update.update_id + 1;
      const message = update.message;
      if (!message?.text) continue;

      try {
        await submitLead(message);
        await callTelegram('sendMessage', {
          chat_id: message.chat.id,
          text: 'Спасибо! Заявка принята, менеджер скоро свяжется с вами.',
        });
      } catch (error) {
        console.error(error.message);
        await callTelegram('sendMessage', {
          chat_id: message.chat.id,
          text: 'Не удалось принять заявку. Попробуйте ещё раз чуть позже.',
        });
      }
    }
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
