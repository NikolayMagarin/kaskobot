import { G4F } from 'g4f';

interface MemoryItem {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const memory: MemoryItem[] = [];

const startSystemMessage: MemoryItem = {
  role: 'system',
  content: `Ты - ИИ-помощник и находишься в групповом чате.
В начале каждого сообщения будет указан его отправитель.
Можешь обратиться к отправителю по имени, если считаешь нужным.
Если вопрос не требует развернутого ответа, то отвечай коротко.
Если сообщение короткое то и ответ должен быть коротким.`,
};

const g4f = new G4F();

export async function askGPT(question: string, userName: string) {
  memory.push({
    role: 'user',
    content: `Отправитель: ${userName}. ${question}`,
  });

  console.log(memory);

  if (memory.length >= 20) {
    memory.shift();
  }

  const messages = [startSystemMessage].concat(memory);

  return g4f.chatCompletion(messages).then(
    (answer) => {
      memory.push({
        role: 'assistant',
        content: answer,
      });

      return answer;
    },
    (_error) => {
      return 'Что-то не так, не могу сейчас ответить';
    }
  );
}

const imgOptions = {
  cartoon: {
    provider: g4f.providers.Emi,
  },
  paint: {
    provider: g4f.providers.Pixart,
    providerOptions: {
      height: 512,
      width: 512,
      samplingMethod: 'SA-Solver',
    },
  },
  realistic: {
    provider: g4f.providers.Prodia,
    providerOptions: {
      model: 'ICantBelieveItsNotPhotography_seco.safetensors [4e7a3dfd]',
      samplingSteps: 15,
      cfgScale: 30,
    },
  },
};

export async function drawImage(request: string) {
  let options = undefined;
  if (request.startsWith('{{cartoon}}')) {
    options = imgOptions.cartoon;
  }
  if (request.startsWith('{{paint}}')) {
    options = imgOptions.paint;
  }
  if (request.startsWith('{{realistic}}')) {
    options = imgOptions.realistic;
  }

  request = request.replace(/{{.+}}/, '');

  console.log(request, options);

  return g4f
    .imageGeneration(request, options)
    .then((base64Image) => Buffer.from(base64Image, 'base64'))
    .catch((reason) => {
      console.error(reason);
      return undefined;
    });
}
