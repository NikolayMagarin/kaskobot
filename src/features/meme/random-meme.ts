import { parseFromString } from 'dom-parser';

export async function getRandomMeme() {
  try {
    const res = await fetch('https://www.memify.ru/highfive/');
    const str = await res.text();
    const parsed = parseFromString(str);

    const url = parsed
      .getElementsByTagName('img')
      .filter((el) => {
        return el.attributes
          .find(({ name }) => name === 'src')
          ?.value.startsWith('https://www.cdn.memify.ru/media');
      })[0]
      .attributes.find(({ name }) => name === 'src')?.value;

    if (!url) {
      return null;
    }

    return Buffer.from(await (await fetch(url)).arrayBuffer());
  } catch (error) {
    console.log(error);
    return null;
  }
}
