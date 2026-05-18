import { execFile } from 'child_process';
import { promisify } from 'util';

const exec = promisify(execFile);

/** Whitelist-only command execution — never pass raw user input to shell */
async function runScript(script: string, args: string[]) {
  return exec('/opt/alphapanel/scripts/' + script, args, { timeout: 120000 });
}

export const hostingHandlers: Record<string, (p: Record<string, unknown>) => Promise<unknown>> = {
  'hosting.create': async (p) => {
    const username = String(p.username ?? '');
    const domain = String(p.domain ?? '');
    if (!/^[a-z0-9_-]+$/.test(username)) throw new Error('Invalid username');
    await runScript('hosting-create.sh', [username, domain]);
    return { username, domain };
  },
  'hosting.suspend': async (p) => {
    await runScript('hosting-suspend.sh', [String(p.username)]);
    return { suspended: true };
  },
  'hosting.unsuspend': async (p) => {
    await runScript('hosting-unsuspend.sh', [String(p.username)]);
    return { suspended: false };
  },
  'hosting.delete': async (p) => {
    await runScript('hosting-delete.sh', [String(p.username)]);
    return { deleted: true };
  },
};
