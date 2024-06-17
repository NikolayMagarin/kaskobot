import TelegramBot from 'node-telegram-bot-api';

export interface Message {
  id: number;
  text: string;
}

let memory: Message[] = [];
export const MAX_MEMORY_SIZE = 500;

export const msgTypeToMessageMap = {
  text: '', // так надо
  animation: '*Отправляет анимированное сообщение*',
  audio: '*Отправляет аудио-сообщение*',
  document: '*Отправляет документ*',
  location: '*Отправляет геолокацию*',
  new_chat_photo: '*Изменяет фотографию чата*',
  new_chat_title: '*Изменяет название чата*',
  photo: '*Отправляет фото*',
  pinned_message: '*Закрепляет сообщение*',
  sticker: '*Отправляет стикер*',
  video: '*Отправляет видео*',
  video_note: '*Отправляет короткое видео (кружочек)*',
  voice: '*Отправляет голосовое сообщение*',
  delete_chat_photo: '*Удаляет фотографию чата*',
};

export type MemorizableMessageType = keyof typeof msgTypeToMessageMap;

export const memorizableMessageTypes = Object.keys(
  msgTypeToMessageMap
) as MemorizableMessageType[];

export function memorizeMessage(
  _bot: TelegramBot,
  msg: TelegramBot.Message,
  data: TelegramBot.Metadata
) {
  if (memorizableMessageTypes.includes(data.type as MemorizableMessageType)) {
    const userName = msg.from?.first_name || msg.from?.username || 'кто-то';
    memory.push({
      id: msg.message_id,
      text: `[${userName}]: ${
        data.type === 'text'
          ? msg.text
          : msgTypeToMessageMap[data.type as MemorizableMessageType]
      }`,
    });
  }

  if (memory.length === MAX_MEMORY_SIZE + 1) {
    memory.shift();
  } else if (memory.length > MAX_MEMORY_SIZE) {
    while (memory.length > MAX_MEMORY_SIZE) {
      memory.shift();
    }
  }
}

export function setMemory(mem: Message[]) {
  memory = mem;
}

export function getMemory() {
  return memory;
}
