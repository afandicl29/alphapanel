export const domainHandlers: Record<string, (p: Record<string, unknown>) => Promise<unknown>> = {
  'domain.add': async (p) => ({ domain: p.name, added: true }),
  'subdomain.add': async (p) => ({ subdomain: p.subdomain, added: true }),
  'dns.sync': async (p) => ({ records: p.records, synced: true }),
  'domain.redirect': async (p) => ({ redirect: p, configured: true }),
};
