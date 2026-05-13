import type { ReactNode } from "react";

export function PanelCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-lg border border-panel-border bg-panel-surface shadow-panel ${className}`}
    >
      {children}
    </div>
  );
}

export function BtnPrimary({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-md border border-blue-700 bg-panel-accent px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-panel-accent-hover"
    >
      {children}
    </button>
  );
}

export function BtnGhost({ children }: { children: ReactNode }) {
  return (
    <button
      type="button"
      className="rounded-md border border-panel-border bg-panel-surface px-3 py-2 text-sm font-medium text-panel-heading shadow-sm transition hover:bg-panel-surface-muted"
    >
      {children}
    </button>
  );
}
