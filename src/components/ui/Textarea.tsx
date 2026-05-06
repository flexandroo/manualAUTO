import type { TextareaHTMLAttributes } from 'react';

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      rows={props.rows ?? 3}
      className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded px-3 py-2 text-sm focus:outline-none focus:border-orange-500 transition-colors resize-y"
    />
  );
}
