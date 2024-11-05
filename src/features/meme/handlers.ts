import { CommandHandler } from '../../manage-commands';
import { getRandomMeme } from './random-meme';

export const handleMeme: CommandHandler = (bot, msg, params, input) => {
  if (input || params.length) return true;

  getRandomMeme().then((meme) => {
    if (meme) {
      bot.sendPhoto(
        msg.chat.id,
        meme,
        {
          reply_to_message_id: msg.message_id,
        },
        {
          filename: 'meme.jpg',
          contentType: 'application/octet-stream',
        }
      );
    } else {
      bot.sendMessage(msg.chat.id, 'Что-то не так, не могу прислать мем', {
        reply_to_message_id: msg.message_id,
      });
    }
  });
};
