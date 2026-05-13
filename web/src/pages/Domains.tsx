import { PageTitle } from "../components/PageTitle";
import { PanelCard, BtnPrimary } from "../components/PanelCard";

const domains = [
  { domain: "contoh.com", root: "public_html", ssl: "Aktif", type: "Utama" },
  { domain: "blog.contoh.com", root: "public_html/blog", ssl: "Aktif", type: "Subdomain" },
];

export function Domains() {
  return (
    <div>
      <PageTitle
        title="Domain"
        subtitle="Domain utama, subdomain, dan pengalihan."
        action={<BtnPrimary>+ Buat subdomain</BtnPrimary>}
      />

      <PanelCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="border-b border-panel-border bg-slate-50 text-xs uppercase text-panel-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Domain</th>
                <th className="px-4 py-3 font-medium">Document root</th>
                <th className="px-4 py-3 font-medium">SSL</th>
                <th className="px-4 py-3 font-medium">Tipe</th>
              </tr>
            </thead>
            <tbody>
              {domains.map((d) => (
                <tr key={d.domain} className="border-b border-panel-border/80 hover:bg-slate-50/80">
                  <td className="px-4 py-3 font-medium text-slate-800">{d.domain}</td>
                  <td className="px-4 py-3 font-mono text-xs text-panel-muted">{d.root}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
                      {d.ssl}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-panel-muted">{d.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PanelCard>
    </div>
  );
}
