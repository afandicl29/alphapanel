import * as net from 'net';
import * as fs from 'fs';
import { handleAction } from './handlers';

const SOCKET_PATH = process.env.DAEMON_SOCKET_PATH || '/var/run/alphapanel/daemon.sock';
const SHARED_SECRET = process.env.DAEMON_SHARED_SECRET || '';

function validateRequest(secret: string): boolean {
  return secret === SHARED_SECRET && SHARED_SECRET.length >= 16;
}

function startServer() {
  if (fs.existsSync(SOCKET_PATH)) fs.unlinkSync(SOCKET_PATH);

  const server = net.createServer((socket) => {
    let buffer = '';
    socket.on('data', async (chunk) => {
      buffer += chunk.toString();
      if (!buffer.includes('\n')) return;
      const line = buffer.split('\n')[0];
      buffer = buffer.slice(line.length + 1);

      try {
        const req = JSON.parse(line) as {
          action: string;
          payload: Record<string, unknown>;
          secret: string;
        };

        if (!validateRequest(req.secret)) {
          socket.end(JSON.stringify({ success: false, error: 'Unauthorized' }) + '\n');
          return;
        }

        const data = await handleAction(req.action, req.payload);
        socket.end(JSON.stringify({ success: true, data }) + '\n');
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        socket.end(JSON.stringify({ success: false, error: message }) + '\n');
      }
    });
  });

  server.listen(SOCKET_PATH, () => {
    fs.chmodSync(SOCKET_PATH, 0o660);
    console.log(`AlphaPanel daemon listening on ${SOCKET_PATH}`);
  });
}

startServer();
