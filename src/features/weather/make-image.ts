import images from 'images';

export async function buildKaskaWithWeatherImage(url: string): Promise<Buffer> {
  const weatherImage = Buffer.from(await (await fetch(url)).arrayBuffer());
  // const kaskaImage = images('assets/kaska512.png');
  // const combined = kaskaImage.draw(weatherImage, 224, 0);

  return weatherImage;
}
