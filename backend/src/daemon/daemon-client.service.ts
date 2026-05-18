import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as net from 'net';

export interface DaemonRequest {
  action: string;
  payload: Record<string, unknown>;
}

export interface DaemonResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Communicates with alphapanel-daemon via Unix socket.
 * All privileged operations MUST go through this client — never shell from API directly.
 */
@Injectable()
export class DaemonClientService {
  private readonly logger = new Logger(DaemonClientService.name);
  private readonly socketPath: string;
  private readonly sharedSecret: string;

  constructor(private readonly config: ConfigService) {
    this.socketPath = config.get('DAEMON_SOCKET_PATH', '/var/run/alphapanel/daemon.sock');
    this.sharedSecret = config.get('DAEMON_SHARED_SECRET', '');
  }

  async execute<T>(request: DaemonRequest): Promise<DaemonResponse<T>> {
    if (process.platform === 'win32') {
      this.logger.warn(`Daemon skipped on ${process.platform}: ${request.action}`);
      return { success: true, data: { mocked: true } as T };
    }

    return new Promise((resolve) => {
      const client = net.createConnection(this.socketPath);
      const timeout = setTimeout(() => {
        client.destroy();
        resolve({ success: false, error: 'Daemon timeout' });
      }, 30000);

      let buffer = '';
      client.on('connect', () => {
        client.write(
          JSON.stringify({ ...request, secret: this.sharedSecret }) + '\n',
        );
      });
      client.on('data', (chunk) => {
        buffer += chunk.toString();
      });
      client.on('end', () => {
        clearTimeout(timeout);
        try {
          resolve(JSON.parse(buffer) as DaemonResponse<T>);
        } catch {
          resolve({ success: false, error: 'Invalid daemon response' });
        }
      });
      client.on('error', (err) => {
        clearTimeout(timeout);
        resolve({ success: false, error: err.message });
      });
    });
  }
}
