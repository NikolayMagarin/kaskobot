import express from 'express';
import fetch from 'node-fetch';

const serverUrl = process.env.SELF_PING_SERVER_URL;
let started = false;
export function startSelfPingLoop() {
  if (!started && serverUrl) {
    const app = express();

    app.get('/', function (_req, res) {
      res.json({ status: 'alive' });
    });

    const server = app.listen(8081, () => {
      started = true;
    });

    server.keepAliveTimeout = 120_000;
  }
}
