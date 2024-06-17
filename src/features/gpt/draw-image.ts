import { randomFromArray } from '../../utils/random-from-array';
import { g4f } from './g4f';
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
  image: Buffer | null;
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

  const translate = g4f.translation({
    text: input,
    source: 'ru',
    target: 'en',
  });

  return translate
    .then((translated) => {
      translateCalback(translated.translation.result, replyMessage);
      return g4f
        .imageGeneration(translated.translation.result, options)
        .then((base64Image) => {
          console.log('drawed');
          return { image: Buffer.from(base64Image, 'base64'), error: null };
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
