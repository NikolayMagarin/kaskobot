import dotevn from 'dotenv';
import assert from 'assert';

dotevn.config();

function getEnvValue(key: string) {
  const val = process.env[key];
  assert(val, `Please set ${key} in environment`);
  return val;
}

export const config = {
  telegramToken: getEnvValue('TELEGRAM_TOKEN'),
  weatherApiKey: getEnvValue('WEATHER_API_KEY'),
  assemblyAiApiKey: getEnvValue('ASSEMBLY_AI_API_KEY'),
  port: getEnvValue('PORT'),
  adminSecret: getEnvValue('ADMIN_SECRET'),
  selfPingSecret: getEnvValue('SELF_PING_SECRET'),
};
