import dotevn from 'dotenv';
import assert from 'assert';

dotevn.config();

function getEnvValue(key: string) {
  const val = process.env[key];
  assert(process.env[key], `Please set ${key} in environment`);
  return val as string;
}

export const config = {
  telegramToken: getEnvValue('TELEGRAM_TOKEN'),
  weatherApiKey: getEnvValue('WEATHER_API_KEY'),
};
