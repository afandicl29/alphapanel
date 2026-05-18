export const sslHandlers: Record<string, (p: Record<string, unknown>) => Promise<unknown>> = {
  'ssl.letsencrypt': async (p) => ({ domain: p.domain, issued: true }),
};
