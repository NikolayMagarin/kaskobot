import dotevn from 'dotenv';
import assert from 'assert';

dotevn.config();

function getEnvValue(key: string) {
  const val = process.env[key];
  assert(val, `Please set ${key} in environment`);
  return val;
}

export const config = {
  serverUrl: getEnvValue('SERVER_URL'),
  adminSecret: getEnvValue('ADMIN_SECRET'),
};
