import type { InputHTMLAttributes } from 'react';

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full bg-white border border-stone-200 text-stone-800 rounded px-3 py-2 text-sm focus:outline-none focus:border-orange-500 transition-colors"
    />
  );
}
