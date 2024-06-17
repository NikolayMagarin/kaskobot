import fetch from 'node-fetch';
import { config } from './config';
import { writeFileSync } from 'fs';

console.log(`${config.serverUrl}/memory/save`);

fetch(`${config.serverUrl}/memory/save`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    adminSecret: config.adminSecret,
  }),
})
  .then((res) => res.json())
  .then((body) => {
    writeFileSync('./data/memory.json', JSON.stringify(body.data));
    console.log(`ok: ${body.ok}`);
  });
