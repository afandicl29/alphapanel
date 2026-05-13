import type { ReactNode } from "react";

export function PageTitle({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-panel-heading md:text-2xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-panel-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
