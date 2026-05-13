import { PageTitle } from "../components/PageTitle";
import { PanelCard } from "../components/PanelCard";

const days = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

export function Metrics() {
  const bars = [12, 28, 18, 40, 22, 35, 20];
  return (
    <div>
      <PageTitle
        title="Metrik & penggunaan"
        subtitle="Kunjungan dan bandwidth (data contoh — hubungkan ke analitik nyata)."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <PanelCard className="p-5">
          <h2 className="text-sm font-semibold text-panel-heading">Permintaan HTTP (7 hari)</h2>
          <div className="mt-6 flex h-40 items-end justify-between gap-2">
            {bars.map((h, i) => (
              <div key={days[i]} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full max-w-[36px] rounded-t-md bg-gradient-to-t from-sky-300 to-panel-accent"
                  style={{ height: `${h * 2}px` }}
                />
                <span className="text-[10px] text-panel-muted">{days[i]}</span>
              </div>
            ))}
          </div>
        </PanelCard>

        <PanelCard className="p-5">
          <h2 className="text-sm font-semibold text-panel-heading">Ringkasan</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex justify-between border-b border-panel-border/80 pb-2">
              <span className="text-panel-muted">Error 5xx (24 jam)</span>
              <span className="font-mono text-slate-700">0</span>
            </li>
            <li className="flex justify-between border-b border-panel-border/80 pb-2">
              <span className="text-panel-muted">Rata-rata TTFB</span>
              <span className="font-mono text-slate-700">142 ms</span>
            </li>
            <li className="flex justify-between">
              <span className="text-panel-muted">Puncak bandwidth</span>
              <span className="font-mono text-slate-700">3.2 MB/s</span>
            </li>
          </ul>
        </PanelCard>
      </div>
    </div>
  );
}
