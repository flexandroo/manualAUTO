import type { ReactNode } from 'react';

interface FieldGroupProps {
  label: string;
  children: ReactNode;
  hint?: string;
}

export function FieldGroup({ label, children, hint }: FieldGroupProps) {
  return (
    <div className="mb-5">
      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
        {label}
      </label>
      {children}
      {hint && <div className="text-[11px] text-slate-500 mt-1">{hint}</div>}
    </div>
  );
}
