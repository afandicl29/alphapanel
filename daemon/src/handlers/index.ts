import { hostingHandlers } from './hosting';
import { domainHandlers } from './domain';
import { sslHandlers } from './ssl';
import { fileHandlers } from './files';
import { databaseHandlers } from './database';
import { dockerHandlers } from './docker';
import { systemHandlers } from './system';

const handlers: Record<string, (payload: Record<string, unknown>) => Promise<unknown>> = {
  ...hostingHandlers,
  ...domainHandlers,
  ...sslHandlers,
  ...fileHandlers,
  ...databaseHandlers,
  ...dockerHandlers,
  ...systemHandlers,
};

export async function handleAction(action: string, payload: Record<string, unknown>) {
  const handler = handlers[action];
  if (!handler) {
    throw new Error(`Unknown action: ${action}`);
  }
  return handler(payload);
}
