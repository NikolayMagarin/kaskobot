import axios from 'axios';
import { handleNexraTask } from '../../utils/nexra-task';
import { randomFromArray } from '../../utils/random-from-array';
import { translation } from '../../utils/translation';
import {
  imgStyles,
  Options,
  SupportedStyle,
  supportedStyles,
} from './img-styles';

type TranslatedCalback = (
  translated: string,
  replyMessage: {
    styleType: string;
    styleSubType: number;
    styleSubTypeLength: number;
  }
) => void;

export function drawImage(
  input: string,
  style: string | undefined,
  translateCalback: TranslatedCalback = () => {}
): Promise<{
  image: string | null;
  error: 'validation' | 'translation' | 'generation' | null;
}> {
  let options: Options;

  const replyMessage = {
    styleType: '',
    styleSubType: 0,
    styleSubTypeLength: 0,
  };

  if (style) {
    const styleParts = style.split('_');
    const styleType = styleParts[0] as SupportedStyle;

    const styleSubType: number | undefined = styleParts[1]
      ? Number(styleParts[1])
      : undefined;

    if (supportedStyles.includes(styleType)) {
      if (styleSubType !== undefined) {
        if (
          Number.isInteger(styleSubType) &&
          styleSubType > 0 &&
          styleSubType <= imgStyles[styleType].length
        ) {
          options = imgStyles[styleType][styleSubType - 1];
          replyMessage.styleType = styleType;
          replyMessage.styleSubType = styleSubType;
          replyMessage.styleSubTypeLength = imgStyles[styleType].length;
        } else {
          return Promise.resolve({ image: null, error: 'validation' });
        }
      } else {
        options = randomFromArray(imgStyles[styleType]);
        replyMessage.styleType = styleType;
        replyMessage.styleSubType = imgStyles[styleType].indexOf(options) + 1;
        replyMessage.styleSubTypeLength = imgStyles[styleType].length;
      }
    } else {
      return Promise.resolve({ image: null, error: 'validation' });
    }
  } else {
    const defaultStyleType = 'realism';
    options = randomFromArray(imgStyles[defaultStyleType]);
    replyMessage.styleType = defaultStyleType;
    replyMessage.styleSubType =
      imgStyles[defaultStyleType].indexOf(options) + 1;
    replyMessage.styleSubTypeLength = imgStyles[defaultStyleType].length;
  }

  const translate = translation({
    text: input,
    source: 'ru',
    target: 'en',
  });

  return translate
    .then((translated) => {
      translateCalback(translated.translate.result, replyMessage);
      return makeImageGenerationRequest(translated.translate.result, options)
        .then((linkToImage) => {
          return { image: linkToImage, error: null };
        })
        .catch((reason) => {
          console.error(reason);
          return Promise.resolve({ image: null, error: 'generation' as const });
        });
    })
    .catch((reason) => {
      console.error(reason);
      return Promise.resolve({ image: null, error: 'translation' as const });
    });
}

function makeImageGenerationRequest(prompt: string, options: Options) {
  let body: Record<string, any> = {};

  switch (options.provider.name) {
    case 'Prodia':
      body = {
        prompt,
        model: 'prodia',
        data: {
          negative_prompt: '',
          model: options.providerOptions?.model,
          sampler: 'DPM++ 2M Karras',
          steps: 25,
          cfg_scale: 7,
        },
      };
      break;

    case 'Emi':
      body = {
        prompt,
        model: 'emi',
      };
      break;
    default:
      break;
  }

  return new Promise<string>((resolve, reject) => {
    axios
      .post('https://nexra.aryahcr.cc/api/image/complements', body, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(
        handleNexraTask(
          (response) => resolve(response.images[0]),
          reject,
          'http://nexra.aryahcr.cc/api/image/complements/'
        )
      )
      .catch((error) => reject(error));
  });
}
