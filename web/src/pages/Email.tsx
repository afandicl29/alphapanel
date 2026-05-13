import { PageTitle } from "../components/PageTitle";
import { PanelCard, BtnPrimary, BtnGhost } from "../components/PanelCard";

const accounts = [
  { address: "admin@contoh.com", quota: "1 GB", used: "120 MB" },
  { address: "sales@contoh.com", quota: "2 GB", used: "340 MB" },
];

export function Email() {
  return (
    <div>
      <PageTitle
        title="Akun Email"
        subtitle="Kotak surat, alias, dan pengalihan."
        action={
          <div className="flex flex-wrap gap-2">
            <BtnGhost>Webmail</BtnGhost>
            <BtnPrimary>+ Akun email</BtnPrimary>
          </div>
        }
      />

      <PanelCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="border-b border-panel-border bg-slate-50 text-xs uppercase text-panel-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Alamat</th>
                <th className="px-4 py-3 font-medium">Kuota</th>
                <th className="px-4 py-3 font-medium">Terpakai</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((a) => (
                <tr key={a.address} className="border-b border-panel-border/80 hover:bg-slate-50/80">
                  <td className="px-4 py-3 text-slate-800">{a.address}</td>
                  <td className="px-4 py-3 text-panel-muted">{a.quota}</td>
                  <td className="px-4 py-3 text-panel-muted">{a.used}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PanelCard>
    </div>
  );
}
