import { CommandHandler } from '../../manage-commands';
import { transcribe } from './transcribe';

export const handleTranscript: CommandHandler = (bot, msg, params, input) => {
  const voiceId =
    msg.reply_to_message?.voice?.file_id ||
    msg.reply_to_message?.video_note?.file_id;

  if (!voiceId) {
    return true;
  }

  bot
    .getFileLink(voiceId)
    .then(transcribe)
    .then((transcripton) => {
      const text = transcripton.text;
      if (typeof text === 'string') {
        bot.sendMessage(msg.chat.id, text ? text : 'Слов не обнаружено', {
          reply_to_message_id: msg.message_id,
        });
      } else {
        throw new Error(`Text is ${typeof text}`);
      }
    })
    .catch((error) => {
      console.error(error);
      bot.sendMessage(msg.chat.id, 'Что-то не так, не могу расшифровать');
    });
};
