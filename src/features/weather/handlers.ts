import { getCurrentWeather } from '.';
import { CommandHandler } from '../../manage-commands';
import { buildKaskaWithWeatherImage } from './make-image';

export const handleGpt: CommandHandler = (bot, msg, params, input) => {
  getCurrentWeather(input).then((weather) => {
    if (weather.error) {
      bot.sendMessage(msg.chat.id, weather.error.message);
    } else {
      buildKaskaWithWeatherImage(
        `https:${weather.current.condition.icon}`
      ).then((photo) => {
        bot.sendPhoto(msg.chat.id, photo);
      });
    }
  });
};
