import { globalData } from '../../global-data';
import { CommandHandler } from '../../manage-commands';
import { summarize } from './summarize';

export const handleSummary: CommandHandler = (bot, msg, params, input) => {
  const firstMessageId = msg.reply_to_message?.message_id;
  const messageToStartSpecified = !!firstMessageId;
  const memoryPartLength = input ? parseInt(input, 10) : undefined;
  const correctLengthSpecified =
    typeof memoryPartLength === 'number' && !Number.isNaN(memoryPartLength);

  let start: number, end: number;

  if (messageToStartSpecified && correctLengthSpecified) {
    // Если и первое сообщение и число N, то пересказ первых N сообщений начиная от этого сообщения
    start = globalData.memory.findIndex(
      (memMessage) => memMessage.id === firstMessageId
    );
    end = Math.min(start + memoryPartLength, globalData.memory.length);
  } else if (messageToStartSpecified && !correctLengthSpecified) {
    // Если только первое сообщение, то пересказ всей беседы начиная от этого сообщения
    start = globalData.memory.findIndex(
      (memMessage) => memMessage.id === firstMessageId
    );
    end = globalData.memory.length;
  } else if (!messageToStartSpecified && correctLengthSpecified) {
    // Если только число N, то пересказ последних N сообщений
    start = Math.max(globalData.memory.length - memoryPartLength, 0);
    end = globalData.memory.length;
  } else {
    // Если ни то, ни то, то пересказ последних 20 сообщений
    start = Math.max(globalData.memory.length - 20, 0);
    end = globalData.memory.length;
  }

  if (start === -1) {
    bot.sendMessage(
      msg.chat.id,
      'Этого сообщения я не помню, я запоминаю лишь 500 последних сообщений (кроме команд и моих ответов на них)',
      { reply_to_message_id: msg.message_id }
    );
    return;
  }

  const memoryPart = globalData.memory.slice(start, end);

  summarize(memoryPart.map((memMessage) => memMessage.text)).then((sum) => {
    bot.sendMessage(msg.chat.id, sum, {
      reply_to_message_id: msg.message_id,
    });
  });
};
