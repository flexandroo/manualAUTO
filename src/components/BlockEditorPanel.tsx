import { Settings } from 'lucide-react';
import type { Block } from '../types/instruction';
import { getBlockSpec } from '../blocks/registry';

interface Props {
  block: Block | null;
  onChange: (block: Block) => void;
}

export function BlockEditorPanel({ block, onChange }: Props) {
  if (!block) {
    return (
      <main className="w-[440px] bg-slate-950 overflow-y-auto p-6 border-r border-slate-800 text-slate-500 text-sm">
        Оберіть блок ліворуч для редагування
      </main>
    );
  }
  const spec = getBlockSpec(block.type);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Editor = spec.Editor as any;
  const Icon = spec.icon;

  return (
    <main className="w-[440px] bg-slate-950 overflow-y-auto p-6 border-r border-slate-800">
      <div className="flex items-center gap-2 mb-5 pb-3 border-b border-slate-800">
        <Settings size={16} className="text-orange-500" />
        <Icon size={14} className="text-slate-400" />
        <h2 className="text-sm font-bold uppercase tracking-wider">{spec.label}</h2>
      </div>
      <Editor data={block} onChange={onChange} />
    </main>
  );
}
