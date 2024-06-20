import { CommandHandler } from '../../manage-commands';
import { getJoke } from './get-joke';

export const handleJoke: CommandHandler = (bot, msg, params, input) => {
  if (params.length > 1 || (params[0] && params[0] !== 'safe')) {
    bot.sendMessage(msg.chat.id, 'Что-то не так с параметрами команды');
  }

  getJoke(input, params[0] === 'safe')
    .then((result) => {
      if (result.joke) {
        bot.sendMessage(
          msg.chat.id,
          (result.keyWord ? `Ключевое слово: ${result.keyWord}\n\n` : '') +
            result.joke.text +
            '\n\nПеревод:\n' +
            result.joke.translated
        );
      } else {
        bot.sendMessage(msg.chat.id, 'Не удалось найти анекдот 😔');
      }
    })
    .catch((reason) => {
      console.log(reason);
      bot.sendMessage(msg.chat.id, 'Не удалось найти анекдот 😔');
    });
};
