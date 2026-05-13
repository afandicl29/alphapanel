import { NavLink, Outlet } from "react-router-dom";
import { Header } from "./Header";

const nav = [
  { to: "/", label: "Beranda", end: true, icon: "◆" },
  { to: "/files", label: "Manajer File", icon: "▤" },
  { to: "/databases", label: "Basis Data", icon: "◉" },
  { to: "/domains", label: "Domain", icon: "◎" },
  { to: "/email", label: "Email", icon: "✉" },
  { to: "/ftp", label: "Akun FTP", icon: "⇄" },
  { to: "/ssl", label: "SSL/TLS", icon: "⬡" },
  { to: "/cron", label: "Cron", icon: "⏱" },
  { to: "/metrics", label: "Metrik", icon: "▣" },
];

export function Layout() {
  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-56 shrink-0 flex-col bg-panel-sidebar text-sky-100/95 shadow-md lg:flex">
        <div className="flex h-14 items-center gap-2 border-b border-white/10 bg-black/10 px-4">
          <span className="flex h-8 w-8 items-center justify-center rounded-md border border-sky-400/40 bg-panel-topbar text-xs font-bold text-white">
            α
          </span>
          <div>
            <p className="text-sm font-semibold tracking-tight text-white">Alphapanel</p>
            <p className="text-[10px] text-sky-200/80">server.contoh.com</p>
          </div>
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 p-2">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "border-l-[3px] border-sky-300 bg-panel-sidebar-active text-white shadow-inner"
                    : "border-l-[3px] border-transparent text-sky-100/90 hover:bg-white/10 hover:text-white",
                ].join(" ")
              }
            >
              <span className="w-5 text-center text-xs opacity-90">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-white/10 p-3 text-[11px] text-sky-200/80">
          Fase 1: UI. API Linux di folder <span className="font-mono text-sky-100">server/</span>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <Header nav={nav} />
        <main className="flex-1 overflow-auto border-t border-panel-border/50 bg-panel-bg p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
