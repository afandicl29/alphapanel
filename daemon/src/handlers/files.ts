export const fileHandlers: Record<string, (p: Record<string, unknown>) => Promise<unknown>> = {
  'files.list': async (p) => ({ path: p.path, entries: [] }),
  'files.upload': async (p) => ({ uploaded: p.filename }),
  'files.chmod': async (p) => ({ path: p.path, mode: p.mode }),
  'files.unzip': async (p) => ({ extracted: p.path }),
};
