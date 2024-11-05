import { prompts } from './gpt-prompts';
import axios from 'axios';
import { handleNexraTask } from '../../utils/nexra-task';

interface MemoryItem {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const memory: Record<number, MemoryItem[]> = {};

export async function askGPT(
  question: string,
  userName: string,
  chatId: number,
  systemPrompt = prompts.system.default
) {
  if (!memory[chatId]) {
    memory[chatId] = [];
  }

  memory[chatId].push({
    role: 'user',
    content: `[${userName}] ${question}`,
  });

  if (memory[chatId].length >= 20) {
    memory[chatId].shift();
  }

  const startSystemMessage: MemoryItem = {
    role: 'system',
    content: systemPrompt,
  };

  const messages = [startSystemMessage].concat(memory[chatId]);

  return makeGptRequest(messages).then(
    (answer) => {
      memory[chatId].push({
        role: 'assistant',
        content: answer,
      });

      return answer;
    },
    (error) => {
      console.error(error);
      return 'Что-то не так, не могу сейчас ответить';
    }
  );
}

export async function clearContext(chatId: number) {
  memory[chatId] = [];
}

// Временная мера пока g4f не починят (а если не починят придется самому писать такую штуку типа gf4)
export function makeGptRequest(messages: MemoryItem[]) {
  return new Promise<string>((resolve, reject) => {
    axios
      .post(
        'https://nexra.aryahcr.cc/api/chat/gpt',
        {
          messages: messages.slice(0, messages.length - 1),
          prompt: messages[messages.length - 1].content,
          model: 'GPT-4',
          markdown: false,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      .then(
        handleNexraTask(
          (response) => {
            resolve(response.gpt);
          },
          reject,
          'https://nexra.aryahcr.cc/api/chat/task/'
        )
      )
      .catch((error) => {
        reject(error);
      });
  });
}
