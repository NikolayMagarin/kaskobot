import express from 'express';
import fetch from 'node-fetch';

const serverUrl = process.env.SELF_PING_SERVER_URL;
let started = false;
export function startSelfPingLoop() {
  if (!started && serverUrl) {
    const app = express();

    app.get('/', function (_req, res) {
      console.log('server still alive');
      setTimeout(() => {
        fetch(serverUrl + '/');
      }, 30_000);
      res.json({ status: 'alive' });
    });

    app.listen(8081, () => {
      fetch(serverUrl + '/');
    });

    started = true;
  }
}
