import fetch from 'node-fetch';
import { config } from '../../config';
import { CurrentWeatherResult } from './types';

export async function getCurrentWeather(location = 'Moscow') {
  const result = await (
    await fetch(
      `http://api.weatherapi.com/v1/current.json?key=${config.weatherApiKey}&q=${location}`
    )
  ).json();

  return result as CurrentWeatherResult;
}
