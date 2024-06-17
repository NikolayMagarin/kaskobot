import { CommandHandler } from '../../manage-commands';
import { getMemory } from './memory';
import { summarize } from './summarize';

export const handleSummary: CommandHandler = (bot, msg, params, input) => {
  const firstMessageId = msg.reply_to_message?.message_id;
  if (!firstMessageId) {
    return true;
  }
  if (input) {
    bot.sendMessage(msg.chat.id, 'Конкретизация пока не поддерживается(');
    return;
  }

  const memory = getMemory();

  const firstMesssageIndex = memory.findIndex(
    (memMessage) => memMessage.id === firstMessageId
  );

  if (firstMesssageIndex === -1) {
    bot.sendMessage(
      msg.chat.id,
      'Этого сообщения я не помню, я запоминаю лишь 500 последних сообщений (не команд)',
      { reply_to_message_id: msg.message_id }
    );
    return;
  }

  // Для теста пока так
  summarize(
    memory.slice(firstMesssageIndex).map((memMessage) => memMessage.text)
  ).then((sum) => {
    bot.sendMessage(msg.chat.id, sum, { reply_to_message_id: msg.message_id });
  });
};
