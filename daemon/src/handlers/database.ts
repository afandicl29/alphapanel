export const databaseHandlers: Record<string, (p: Record<string, unknown>) => Promise<unknown>> = {
  'database.create': async (p) => ({ name: p.name, created: true }),
  'database.user.create': async (p) => ({ username: p.username, created: true }),
  'database.backup': async (p) => ({ backupId: p.databaseId, path: '/var/backups/alphapanel' }),
  'database.restore': async (p) => ({ restored: p.databaseId }),
};
