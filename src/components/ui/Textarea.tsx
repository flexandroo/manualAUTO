import type { TextareaHTMLAttributes } from 'react';

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      rows={props.rows ?? 3}
      className="w-full bg-white border border-stone-200 text-stone-800 rounded px-3 py-2 text-sm focus:outline-none focus:border-orange-500 transition-colors resize-y"
    />
  );
}
