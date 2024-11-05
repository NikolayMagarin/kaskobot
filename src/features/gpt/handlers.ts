import { CommandHandler } from '../../manage-commands';
import { askGPT, clearContext } from './ask-gpt';
import { drawImage } from './draw-image';

export const handleGpt: CommandHandler = (bot, msg, params, input) => {
  if (!input) return true;

  const userName = msg.from?.first_name || msg.from?.username || 'неизвестный';
  askGPT(input, userName, msg.chat.id).then((answer) => {
    bot.sendMessage(msg.chat.id, answer, {
      parse_mode: 'Markdown',
    });
  });
};

export const handleGptClear: CommandHandler = (bot, msg, params, input) => {
  clearContext(msg.chat.id);
  bot.sendMessage(msg.chat.id, 'Контекст удален');
};

export const handleImg: CommandHandler = (bot, msg, params, input) => {
  if (!input) return true;
  const style = params[0] || undefined;

  drawImage(input, style, (translated, reply) => {
    bot.sendMessage(
      msg.chat.id,
      `Рисую: ${translated}\nМодель: ${reply.styleType}[${reply.styleSubType}/${reply.styleSubTypeLength}]`,
      {
        reply_to_message_id: msg.message_id,
      }
    );
  }).then((image) => {
    if (image.image) {
      bot.sendPhoto(msg.chat.id, image.image, {
        reply_to_message_id: msg.message_id,
      });
    } else {
      let errorMessage = 'Что-то не так, не могу нарисовать';
      if (image.error === 'validation') {
        errorMessage = 'Что-то не так с параметрами команды';
      } else if (image.error === 'translation') {
        errorMessage = 'Что-то не так, не могу перевести на английский';
      }
      bot.sendMessage(msg.chat.id, errorMessage, {
        reply_to_message_id: msg.message_id,
      });
    }
  });
};
