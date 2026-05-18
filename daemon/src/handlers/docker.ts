export const dockerHandlers: Record<string, (p: Record<string, unknown>) => Promise<unknown>> = {
  'docker.create': async (p) => ({ container: p.name, status: 'running' }),
  'docker.restart': async (p) => ({ id: p.id, restarted: true }),
  'docker.compose': async (p) => ({ name: p.name, deployed: true }),
};
