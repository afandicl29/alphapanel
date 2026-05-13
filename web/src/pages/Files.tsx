import { useState } from "react";
import { PageTitle } from "../components/PageTitle";
import { PanelCard, BtnPrimary, BtnGhost } from "../components/PanelCard";

const tree = [
  { name: "public_html", type: "dir" as const },
  { name: "logs", type: "dir" as const },
  { name: ".htaccess", type: "file" as const },
  { name: "wp-config.php", type: "file" as const },
];

const files = [
  { name: "index.php", size: "4.1 KB", date: "12 Mei 2026", perm: "644" },
  { name: "style.css", size: "12 KB", date: "10 Mei 2026", perm: "644" },
  { name: "uploads", size: "—", date: "01 Mei 2026", perm: "755" },
];

export function Files() {
  const [path, setPath] = useState("/home/user/public_html");

  return (
    <div>
      <PageTitle
        title="Manajer File"
        subtitle="Telusuri, unggah, dan ubah izin file di akun Anda."
        action={
          <div className="flex flex-wrap gap-2">
            <BtnGhost>Unggah</BtnGhost>
            <BtnPrimary>+ Folder baru</BtnPrimary>
          </div>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
        <PanelCard className="p-3">
          <p className="px-2 text-[11px] font-medium uppercase text-panel-muted">Folder</p>
          <ul className="mt-2 space-y-0.5">
            {tree.map((n) => (
              <li key={n.name}>
                <button
                  type="button"
                  onClick={() =>
                    setPath(
                      n.type === "dir" ? `/home/user/${n.name}` : `/home/user/public_html/${n.name}`
                    )
                  }
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-slate-800 hover:bg-panel-surface-muted"
                >
                  <span className="text-panel-muted">{n.type === "dir" ? "▸" : "◇"}</span>
                  {n.name}
                </button>
              </li>
            ))}
          </ul>
        </PanelCard>

        <PanelCard className="overflow-hidden">
          <div className="flex flex-wrap items-center gap-2 border-b border-panel-border bg-panel-surface-muted px-4 py-2 text-xs text-panel-muted">
            <span className="font-mono text-slate-700">{path}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="border-b border-panel-border bg-slate-50 text-xs uppercase text-panel-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">Nama</th>
                  <th className="px-4 py-3 font-medium">Ukuran</th>
                  <th className="px-4 py-3 font-medium">Diubah</th>
                  <th className="px-4 py-3 font-medium">Izin</th>
                </tr>
              </thead>
              <tbody>
                {files.map((f) => (
                  <tr key={f.name} className="border-b border-panel-border/80 hover:bg-slate-50/80">
                    <td className="px-4 py-2.5 font-medium text-slate-800">{f.name}</td>
                    <td className="px-4 py-2.5 text-panel-muted">{f.size}</td>
                    <td className="px-4 py-2.5 text-panel-muted">{f.date}</td>
                    <td className="px-4 py-2.5 font-mono text-xs text-slate-500">{f.perm}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </PanelCard>
      </div>
    </div>
  );
}
