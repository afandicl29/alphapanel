import { Link } from "react-router-dom";
import { PageTitle } from "../components/PageTitle";
import { PanelCard, BtnPrimary } from "../components/PanelCard";

const stats = [
  { label: "Penggunaan disk", value: "4.2 GB", sub: "dari 50 GB", pct: 8 },
  { label: "Bandwidth (bulan ini)", value: "128 GB", sub: "tidak terbatas", pct: 0 },
  { label: "Akun email", value: "3", sub: "dari 100", pct: 3 },
  { label: "Basis data", value: "2", sub: "maks 25", pct: 8 },
];

const shortcuts = [
  { title: "Manajer File", desc: "Unggah, edit, izin folder", to: "/files" },
  { title: "phpMyAdmin", desc: "Kelola MySQL/MariaDB", to: "/databases" },
  { title: "SSL", desc: "AutoSSL & sertifikat", to: "/ssl" },
  { title: "Cron Jobs", desc: "Jadwalkan tugas", to: "/cron" },
];

export function Dashboard() {
  return (
    <div>
      <PageTitle
        title="Beranda"
        subtitle="Ringkasan akun hosting — data contoh hingga API server terhubung."
        action={<BtnPrimary>+ Buat cadangan</BtnPrimary>}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <PanelCard key={s.label} className="p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-panel-muted">{s.label}</p>
            <p className="mt-2 text-2xl font-semibold text-panel-heading">{s.value}</p>
            <p className="text-xs text-slate-500">{s.sub}</p>
            {s.pct > 0 && (
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-panel-accent"
                  style={{ width: `${Math.min(100, s.pct * 12)}%` }}
                />
              </div>
            )}
          </PanelCard>
        ))}
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <PanelCard className="p-4 lg:col-span-2">
          <h2 className="text-sm font-semibold text-panel-heading">Pintasan</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {shortcuts.map((x) => (
              <li key={x.title}>
                <Link
                  to={x.to}
                  className="block rounded-md border border-panel-border bg-panel-surface-muted p-3 transition hover:border-panel-accent/50 hover:bg-white"
                >
                  <p className="font-medium text-slate-800">{x.title}</p>
                  <p className="text-xs text-panel-muted">{x.desc}</p>
                </Link>
              </li>
            ))}
          </ul>
        </PanelCard>

        <PanelCard className="p-4">
          <h2 className="text-sm font-semibold text-panel-heading">Informasi server</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between gap-2">
              <dt className="text-panel-muted">PHP</dt>
              <dd className="font-mono text-slate-700">8.3</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-panel-muted">Web server</dt>
              <dd className="text-slate-700">LiteSpeed</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-panel-muted">Perangkat lunak</dt>
              <dd className="text-slate-700">WordPress 6.7</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-panel-muted">Zona waktu</dt>
              <dd className="text-slate-700">Asia/Jakarta</dd>
            </div>
          </dl>
        </PanelCard>
      </div>
    </div>
  );
}
