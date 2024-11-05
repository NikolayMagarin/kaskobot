import axios, { AxiosResponse } from 'axios';
import { sleep } from './sleep';

export function handleNexraTask(
  resolve: (value: any) => void,
  reject: (reason?: any) => void,
  taskUrl: string
) {
  return async (result: AxiosResponse) => {
    let id = encodeURIComponent(result.data.id);

    let response = null;
    let data = true;
    while (data) {
      await sleep(500);

      response = await axios.get(taskUrl + id);
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
      resolve(response);
    } else {
      reject(response);
    }
  };
}
