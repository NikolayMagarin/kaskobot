import { g4f } from './g4f';
import { prompts } from './gpt-prompts';

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

  return g4f.chatCompletion(messages).then(
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
