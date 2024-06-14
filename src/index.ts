import TelegramBot from 'node-telegram-bot-api';
import { askGPT, drawImage } from './features/gpt';
import { buildKaskaWithWeatherImage } from './features/weather/make-image';
import { getCurrentWeather } from './features/weather';

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN!, {
  polling: {
    autoStart: true,
    interval: 1000,
  },
});

bot.onText(/\/weather (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;

  if (!match) {
    return;
  }

  const location = match[1];
  const weather = await getCurrentWeather(location);

  if (weather.error) {
    bot.sendMessage(chatId, weather.error.message);
  } else {
    const photo = await buildKaskaWithWeatherImage(
      `https:${weather.current.condition.icon}`
    );
    bot.sendPhoto(chatId, photo);
    // bot.setChatPhoto(chatId, photo);
  }
});

bot.onText(/\/gpt (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;

  if (!match) {
    return;
  }

  const question = match[1];
  const userName = msg.from?.first_name || msg.from?.username;
  askGPT(question, userName || 'неизвестный').then((answer) => {
    bot.sendMessage(chatId, answer);
  });
});

bot.onText(/\/img (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;

  if (!match) {
    return;
  }

  const request = match[1];
  drawImage(request).then((image) => {
    if (image) {
      bot.sendPhoto(chatId, image, { reply_to_message_id: msg.message_id });
    } else {
      bot.sendMessage(chatId, 'Что-то не так, не могу сейчас нарисовать', {
        reply_to_message_id: msg.message_id,
      });
    }
  });
});

bot.onText(/[^\/].*/, () => {
  // any text
  // Думаю может сохранять все сообщения?
});
