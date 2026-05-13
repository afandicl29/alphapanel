import { PageTitle } from "../components/PageTitle";
import { PanelCard, BtnPrimary, BtnGhost } from "../components/PanelCard";

const dbs = [
  { name: "user_wp", size: "42 MB", users: "user_wp", host: "localhost" },
  { name: "user_shop", size: "8 MB", users: "user_shop", host: "localhost" },
];

export function Databases() {
  return (
    <div>
      <PageTitle
        title="Basis Data MySQL"
        subtitle="Buat basis data dan pengguna; lalu tautkan ke aplikasi Anda."
        action={
          <div className="flex flex-wrap gap-2">
            <BtnGhost>Buka phpMyAdmin</BtnGhost>
            <BtnPrimary>+ Basis data baru</BtnPrimary>
          </div>
        }
      />

      <PanelCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead className="border-b border-panel-border bg-slate-50 text-xs uppercase text-panel-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Nama</th>
                <th className="px-4 py-3 font-medium">Ukuran</th>
                <th className="px-4 py-3 font-medium">Pengguna</th>
                <th className="px-4 py-3 font-medium">Host</th>
                <th className="px-4 py-3 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {dbs.map((d) => (
                <tr key={d.name} className="border-b border-panel-border/80 hover:bg-slate-50/80">
                  <td className="px-4 py-3 font-mono text-slate-800">{d.name}</td>
                  <td className="px-4 py-3 text-panel-muted">{d.size}</td>
                  <td className="px-4 py-3 font-mono text-sm text-slate-600">{d.users}</td>
                  <td className="px-4 py-3 text-panel-muted">{d.host}</td>
                  <td className="px-4 py-3 text-right">
                    <button type="button" className="text-xs font-medium text-panel-accent hover:underline">
                      Kelola
                    </button>
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
