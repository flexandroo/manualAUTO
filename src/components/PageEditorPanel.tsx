import { Settings } from 'lucide-react';
import type { Page } from '../types/instruction';
import { getPageSpec } from '../pages/pageRegistry';

interface Props {
  page: Page | null;
  onChange: (page: Page) => void;
}

export function PageEditorPanel({ page, onChange }: Props) {
  if (!page) {
    return (
      <main className="w-[480px] bg-slate-950 overflow-y-auto p-6 border-r border-slate-800 text-slate-500 text-sm">
        Оберіть сторінку ліворуч для редагування
      </main>
    );
  }
  const spec = getPageSpec(page.type);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Editor = spec.Editor as any;
  const Icon = spec.icon;

  return (
    <main className="w-[480px] bg-slate-950 overflow-y-auto p-6 border-r border-slate-800">
      <div className="flex items-center gap-2 mb-5 pb-3 border-b border-slate-800">
        <Settings size={16} className="text-orange-500" />
        <Icon size={14} className="text-slate-400" />
        <h2 className="text-sm font-bold uppercase tracking-wider">{spec.label}</h2>
      </div>
      <Editor data={page} onChange={onChange} />
    </main>
  );
}
