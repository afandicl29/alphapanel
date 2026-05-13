import { PageTitle } from "../components/PageTitle";
import { PanelCard, BtnPrimary } from "../components/PanelCard";

const jobs = [
  { expr: "0 * * * *", cmd: "php /home/user/cron/hourly.php", email: "none" },
  { expr: "15 2 * * *", cmd: "wget -q -O /dev/null https://contoh.com/wp-cron.php", email: "user@contoh.com" },
];

export function Cron() {
  return (
    <div>
      <PageTitle
        title="Cron Jobs"
        subtitle="Jalankan perintah pada jadwal tetap (format cron standar)."
        action={<BtnPrimary>+ Cron baru</BtnPrimary>}
      />

      <PanelCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-panel-border bg-slate-50 text-xs uppercase text-panel-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Jadwal</th>
                <th className="px-4 py-3 font-medium">Perintah</th>
                <th className="px-4 py-3 font-medium">Email output</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((j) => (
                <tr key={j.cmd} className="border-b border-panel-border/80 hover:bg-slate-50/80">
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-blue-700">{j.expr}</td>
                  <td className="max-w-md px-4 py-3 font-mono text-xs text-slate-600">{j.cmd}</td>
                  <td className="px-4 py-3 text-panel-muted">{j.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PanelCard>
    </div>
  );
}
