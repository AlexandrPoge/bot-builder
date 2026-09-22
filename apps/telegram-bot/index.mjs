const token = process.env.TELEGRAM_BOT_TOKEN;
const webhookUrl = process.env.N8N_WEBHOOK_URL ?? 'http://localhost:5678/webhook/telegram-lead';

if (!token) {
  throw new Error('Set TELEGRAM_BOT_TOKEN before starting the bot.');
}

const telegramApi = `https://api.telegram.org/bot${token}`;
const sessions = new Map();
let offset = 0;

const questions = [
  {
    key: 'service',
    text: 'Какой ремонт вам нужен?',
    options: ['Квартира под ключ', 'Ванная', 'Косметический', 'Другое'],
  },
  { key: 'city', text: 'В каком городе находится объект?' },
  {
    key: 'details',
    text: 'Коротко опишите задачу: площадь, бюджет и желаемые сроки. Если чего-то пока не знаете — это нормально.',
  },
];

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

function contactFor(message) {
  return message.from.username ? `@${message.from.username}` : `telegram:${message.from.id}`;
}

function leadText(answers) {
  return [
    `Услуга: ${answers.service}`,
    `Город: ${answers.city}`,
    `Детали: ${answers.details}`,
  ].join('\n');
}

async function submitLead(message, answers) {
  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      source: 'telegram',
      contact: contactFor(message),
      message: leadText(answers),
      telegram_chat_id: String(message.chat.id),
      answers,
    }),
  });

  if (!response.ok) {
    throw new Error(`Lead intake endpoint returned ${response.status}`);
  }
}

async function send(chatId, text, options = {}) {
  await callTelegram('sendMessage', { chat_id: chatId, text, ...options });
}

async function askQuestion(chatId, step) {
  const question = questions[step];
  const replyMarkup = question.options
    ? { keyboard: [question.options.slice(0, 2), question.options.slice(2)], resize_keyboard: true, one_time_keyboard: true }
    : { remove_keyboard: true };

  await send(chatId, `${step + 1}/${questions.length}. ${question.text}`, { reply_markup: replyMarkup });
}

async function handleMessage(message) {
  const text = message.text.trim();
  const chatId = message.chat.id;
  const command = text.toLowerCase().split(/\s+/)[0].split('@')[0];

  if (command === '/start') {
    sessions.set(chatId, { step: 0, answers: {} });
    await send(chatId, 'Здравствуйте! Помогу передать заявку на ремонт менеджеру. Три коротких шага — около минуты.');
    await askQuestion(chatId, 0);
    return;
  }

  const session = sessions.get(chatId);
  if (!session) {
    sessions.set(chatId, { step: 0, answers: {} });
    await send(chatId, 'Рад снова помочь. Начнём новую заявку.');
    await askQuestion(chatId, 0);
    return;
  }

  const question = questions[session.step];
  session.answers[question.key] = text;
  session.step += 1;
  if (session.step < questions.length) {
    await askQuestion(chatId, session.step);
    return;
  }

  try {
    await submitLead(message, session.answers);
    sessions.delete(chatId);
    await send(chatId, 'Спасибо! Заявка принята. Менеджер свяжется с вами в ближайшее время.');
  } catch (error) {
    console.error(error.message);
    // Keep answers so the client can retry the final message without filling the form again.
    session.step = questions.length - 1;
    await send(chatId, 'Не удалось передать заявку. Попробуйте отправить последнее сообщение ещё раз чуть позже.');
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

      try { await handleMessage(message); }
      catch (error) { console.error(error.message); }
    }
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
