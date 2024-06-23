import TelegramBot from 'node-telegram-bot-api';
import { globalData } from '../../global-data';
import { transcribe } from '../transcribe/transcribe';

globalData.memory = [];
export const MAX_MEMORY_SIZE = 500;

export type MemorizableMessageType =
  | 'text'
  | 'animation'
  | 'audio'
  | 'document'
  | 'location'
  | 'new_chat_photo'
  | 'new_chat_title'
  | 'photo'
  | 'pinned_message'
  | 'sticker'
  | 'video'
  | 'video_note'
  | 'voice'
  | 'delete_chat_photo';

type ConvertFunction =
  | ((msg: TelegramBot.Message, bot: TelegramBot) => string)
  | ((msg: TelegramBot.Message, bot: TelegramBot) => Promise<string>);

export const msgToText: Record<MemorizableMessageType, ConvertFunction> = {
  text: (msg, _bot) => msg.text as string,
  animation: (_msg, _bot) => '*Отправляет анимированное сообщение*',
  audio: (_msg, _bot) => '*Отправляет аудио-сообщение*',
  document: (_msg, _bot) => '*Отправляет документ*',
  location: (_msg, _bot) => '*Отправляет геолокацию*',
  new_chat_photo: (_msg, _bot) => '*Изменяет фотографию чата*',
  new_chat_title: (_msg, _bot) => '*Изменяет название чата*',
  photo: (_msg, _bot) => '*Отправляет фото*',
  pinned_message: (_msg, _bot) => '*Закрепляет сообщение*',
  sticker: (_msg, _bot) => '*Отправляет стикер*',
  video: (_msg, _bot) => '*Отправляет видео*',
  video_note: async (msg, bot) =>
    (await transcribe(await bot.getFileLink(msg.video_note?.file_id!)))
      .text as string,
  voice: async (msg, bot) =>
    (await transcribe(await bot.getFileLink(msg.voice?.file_id!)))
      .text as string,
  delete_chat_photo: (_msg, _bot) => '*Удаляет фотографию чата*',
};

export const memorizableMessageTypes = Object.keys(
  msgToText
) as MemorizableMessageType[];

export async function memorizeMessage(
  bot: TelegramBot,
  msg: TelegramBot.Message,
  data: TelegramBot.Metadata
) {
  if (memorizableMessageTypes.includes(data.type as MemorizableMessageType)) {
    const userName = msg.from?.first_name || msg.from?.username || 'кто-то';
    const messageText = msgToText[data.type as MemorizableMessageType](
      msg,
      bot
    );
    globalData.memory.push({
      id: msg.message_id,
      text: `[${userName}]: ${await messageText}`,
    });
  }

  if (globalData.memory.length === MAX_MEMORY_SIZE + 1) {
    globalData.memory.shift();
  } else if (globalData.memory.length > MAX_MEMORY_SIZE) {
    while (globalData.memory.length > MAX_MEMORY_SIZE) {
      globalData.memory.shift();
    }
  }
}
