import { g4f } from './g4f';
import { prompts } from './gpt-prompts';
import axios from 'axios';
import { sleep } from '../../utils/sleep';
import { rejects } from 'assert';

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

  // return g4f.chatCompletion(messages).then(
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
      .then(async (result) => {
        let id = encodeURIComponent(result.data.id);

        let response = null;
        let data = true;
        while (data) {
          await sleep(500);

          response = await axios.get(
            'https://nexra.aryahcr.cc/api/chat/task/' + id
          );
          response = response.data;

          switch (response.status) {
            case 'pending':
              data = true;
              break;
            case 'error':
            case 'completed':
            case 'not_found':
              data = false;
              break;
          }
        }

        if (response.status === 'completed') {
          resolve(response.gpt);
        } else {
          reject(response);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}
