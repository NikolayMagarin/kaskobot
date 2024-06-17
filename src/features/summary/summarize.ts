import { g4f } from './g4f';

const systemMessage = `Кратко пересскажи эту беседу, оперируй именами если нужно. В ответе должен быть только сжатый перессказ, не нужно писать вводные фразы. Вот сама беседа:`;
const approximateMaxChunkSize = 2000; // Максимальное количество символов в чанке

export function summarize(discussion: string[]) {
  const discussionSize = discussion.reduce((size, msg) => size + msg.length, 0);
  const approximateChunkSize = Math.ceil(
    discussionSize / Math.ceil(discussionSize / approximateMaxChunkSize)
  );

  let curChunk: string[] = [];
  let curChunkSize = 0;
  const chunkPromises: Promise<any>[] = [];

  for (let i = 0; i < discussion.length; i++) {
    const memMessage = discussion[i];
    curChunk.push(memMessage);
    curChunkSize += memMessage.length;

    if (curChunkSize >= approximateChunkSize || i === discussion.length - 1) {
      chunkPromises.push(
        g4f.chatCompletion([
          {
            role: 'user',
            content: systemMessage + '\n' + curChunk.join('\n'),
          },
        ])
      );
      curChunk = [];
      curChunkSize = 0;
    }
  }

  return Promise.allSettled(chunkPromises).then((results) =>
    results
      .map((result) => {
        if (result.status === 'fulfilled') {
          return result.value;
        } else {
          console.log(result.reason);
          return '[этот отравок перессказать не удалось]';
        }
      })
      .join(' ')
  );
}
