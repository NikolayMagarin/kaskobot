import express, { RequestHandler } from 'express';
import fetch from 'node-fetch';
import { config } from './config';
import { getMemory, setMemory } from './features/summary/memory';

const useAdminSecret: RequestHandler = (req, res, next) => {
  if (req.body?.adminSecret === config.adminSecret) {
    next();
  } else {
    res.status(403).json({ ok: false, data: 'You are not an admin!' });
  }
};

let started = false;
export function startKeepAliveServer() {
  if (!started) {
    const app = express();
    const port = config.port;
    const selfUrl = process.env.SELF_URL || `http://localhost:${port}`;

    app
      .post('/', express.json(), useAdminSecret, function (req, res) {
        setTimeout(() => {
          fetch(selfUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              adminSecret: config.adminSecret,
            }),
          }).catch();
        }, 30_000);
        res.json({ ok: true, status: 'alive' });
      })
      .post(
        '/memory/save',
        express.json(),
        useAdminSecret,
        function (req, res) {
          res.status(200).json({ ok: true, data: getMemory() });
        }
      )
      .post(
        '/memory/restore',
        express.json(),
        useAdminSecret,
        function (req, res) {
          if (
            !req.body?.data ||
            !Array.isArray(req.body.data) ||
            (req.body.data.length &&
              (typeof req.body.data[0]?.id !== 'number' ||
                typeof req.body.data[0]?.text !== 'string'))
          ) {
            res.status(400).json({ ok: false, data: 'invalid data' });
            return;
          }
          setMemory(req.body.data);
          res.status(200).json({ ok: true });
        }
      );

    const server = app.listen(port, () => {
      started = true;
      console.log('server started');
    });

    fetch(selfUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        adminSecret: config.adminSecret,
      }),
    })
      .then(() => {
        console.log('self ping loop activated');
      })
      .catch((err) => {
        console.error(err);
        console.log('cannot activate self ping loop');
      });

    return server;
  }
}
