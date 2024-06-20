import fetch from 'node-fetch';
import { G4F } from 'g4f';

export const g4f = new G4F();

interface JokeResult {
  error?: boolean;
  errorMessage?: string;
  joke?: {
    originalLang: string;
    text: string;
    translated: string;
  };
  keyWord?: string;
}

export function getJoke(
  keyWord: string | undefined,
  safeMode: boolean
): Promise<JokeResult> {
  const translateKeyWord = keyWord
    ? g4f
        .translation({
          text: keyWord,
          source: 'ru',
          target: 'en',
        })
        .then((translated) => translated.translation.result as string)
    : Promise.resolve(undefined);

  return translateKeyWord
    .then((keyWordTranslated) =>
      fetch(
        'https://v2.jokeapi.dev/joke/Any?' +
          (keyWordTranslated
            ? `contains=${encodeURIComponent(keyWordTranslated)}&`
            : '') +
          (safeMode ? 'safe-mode' : '')
      )
        .then((res) => res.json())
        .then((result) => {
          const joke: string | undefined =
            result.joke ||
            (result.setup ? result.setup + '\n' + result.delivery : undefined);

          if (joke) {
            return g4f
              .translation({
                text: joke,
                source: result.lang,
                target: 'ru',
              })
              .then<JokeResult>((translated) => {
                return {
                  joke: {
                    text: joke,
                    translated: translated.translation.result,
                    originalLang: result.lang,
                  },
                  keyWord: keyWordTranslated,
                };
              })
              .catch<JokeResult>((reason) => {
                console.log(reason);

                return {
                  joke: {
                    text: joke,
                    translated: 'Не удалось перевести анекдот 😔',
                    originalLang: result.lang,
                  },
                  keyWord: keyWordTranslated,
                };
              });
          }

          return {
            error: result.error,
            errorMessage: result.message,
          };
        })
    )
    .catch((reason) => {
      console.log(reason);
      return { error: true, errorMessage: reason };
    });
}
