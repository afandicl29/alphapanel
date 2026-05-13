import { PageTitle } from "../components/PageTitle";
import { PanelCard, BtnPrimary } from "../components/PanelCard";

const ftp = [
  { user: "user_ftp", dir: "public_html", status: "Aktif" },
  { user: "deploy_bot", dir: "public_html/app", status: "Aktif" },
];

export function Ftp() {
  return (
    <div>
      <PageTitle
        title="Akun FTP"
        subtitle="Klien FTP/SFTP untuk unggah file ke server."
        action={<BtnPrimary>+ Akun FTP</BtnPrimary>}
      />

      <PanelCard className="overflow-hidden p-4 md:p-5">
        <p className="text-xs text-panel-muted">
          Host: <span className="font-mono text-slate-700">ftp.contoh.com</span> — Port:{" "}
          <span className="font-mono text-slate-700">21</span> (SFTP:{" "}
          <span className="font-mono text-slate-700">22</span>)
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead className="border-b border-panel-border bg-slate-50 text-xs uppercase text-panel-muted">
              <tr>
                <th className="py-2 pr-4 font-medium">Pengguna</th>
                <th className="py-2 pr-4 font-medium">Direktori</th>
                <th className="py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {ftp.map((f) => (
                <tr key={f.user} className="border-b border-panel-border/80">
                  <td className="py-2.5 pr-4 font-mono text-slate-800">{f.user}</td>
                  <td className="py-2.5 pr-4 font-mono text-xs text-panel-muted">{f.dir}</td>
                  <td className="py-2.5 font-medium text-emerald-700">{f.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PanelCard>
    </div>
  );
}
