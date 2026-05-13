import { PageTitle } from "../components/PageTitle";
import { PanelCard, BtnPrimary, BtnGhost } from "../components/PanelCard";

const certs = [
  { domain: "contoh.com", issuer: "Let's Encrypt", expires: "10 Agu 2026", auto: true },
  { domain: "blog.contoh.com", issuer: "Let's Encrypt", expires: "10 Agu 2026", auto: true },
];

export function Ssl() {
  return (
    <div>
      <PageTitle
        title="SSL/TLS"
        subtitle="Sertifikat untuk HTTPS — AutoSSL biasanya dikelola host."
        action={
          <div className="flex flex-wrap gap-2">
            <BtnGhost>Instal manual</BtnGhost>
            <BtnPrimary>Jalankan AutoSSL</BtnPrimary>
          </div>
        }
      />

      <PanelCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="border-b border-panel-border bg-slate-50 text-xs uppercase text-panel-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Domain</th>
                <th className="px-4 py-3 font-medium">Penerbit</th>
                <th className="px-4 py-3 font-medium">Kadaluarsa</th>
                <th className="px-4 py-3 font-medium">Auto</th>
              </tr>
            </thead>
            <tbody>
              {certs.map((c) => (
                <tr key={c.domain} className="border-b border-panel-border/80 hover:bg-slate-50/80">
                  <td className="px-4 py-3 font-medium text-slate-800">{c.domain}</td>
                  <td className="px-4 py-3 text-panel-muted">{c.issuer}</td>
                  <td className="px-4 py-3 text-panel-muted">{c.expires}</td>
                  <td className="px-4 py-3">
                    {c.auto ? (
                      <span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-800">
                        Ya
                      </span>
                    ) : (
                      <span className="text-panel-muted">Tidak</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PanelCard>
    </div>
  );
}
