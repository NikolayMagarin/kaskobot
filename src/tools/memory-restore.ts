import fetch from 'node-fetch';
import { config } from './config';
import { readFileSync } from 'fs';

fetch(`${config.serverUrl}/memory/restore`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    adminSecret: config.adminSecret,
    data: JSON.parse(readFileSync('./temp-data/memory.json').toString()),
  }),
})
  .then((res) => res.json())
  .then((body) => {
    console.log(`ok: ${body.ok}`);
    if (!body.ok) {
      console.log(body.data);
    }
  });
