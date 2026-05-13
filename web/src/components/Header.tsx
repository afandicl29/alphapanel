import { useState } from "react";
import { NavLink } from "react-router-dom";

type NavItem = { to: string; label: string; end?: boolean; icon: string };

export function Header({ nav }: { nav: NavItem[] }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 bg-panel-topbar text-white shadow-panel">
      <div className="flex h-14 items-center justify-between gap-4 px-4 md:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="rounded-md p-2 text-sky-100 hover:bg-white/10 lg:hidden"
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="lg:hidden">
            <p className="text-sm font-semibold">Alphapanel</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden rounded-full bg-emerald-500/25 px-2 py-0.5 text-[11px] font-medium text-emerald-100 sm:inline">
            Online
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-sky-300/50 bg-panel-sidebar text-xs font-bold text-white">
            A
          </div>
        </div>
      </div>

      {open && (
        <div className="border-t border-white/15 bg-panel-sidebar p-2 lg:hidden">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm",
                  isActive ? "bg-panel-sidebar-active text-white" : "text-sky-100",
                ].join(" ")
              }
            >
              <span className="w-5 text-center">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
}
