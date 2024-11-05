import axios from 'axios';
import type { G4F } from 'g4f';
import { handleNexraTask } from './nexra-task';

export function translation(options: Parameters<G4F['translation']>[0]) {
  return new Promise<any>((resolve, reject) => {
    axios
      .post(
        'https://nexra.aryahcr.cc/api/translate/',
        {
          text: options.text,
          source: options.source,
          target: options.target,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      .then(
        handleNexraTask(
          resolve,
          reject,
          'https://nexra.aryahcr.cc/api/translate/'
        )
      )
      .catch((error) => {
        reject(error);
      });
  });
}
