import images from 'images';
import { imageUrlToBase64 } from '../../utils/imageUrlToBase64';

export async function buildKaskaWithWeatherImage(url: string): Promise<Buffer> {
  const weatherImage = Buffer.from(await (await fetch(url)).arrayBuffer());
  // const kaskaImage = images('assets/kaska512.png');
  // const combined = kaskaImage.draw(weatherImage, 224, 0);

  return weatherImage;
}
