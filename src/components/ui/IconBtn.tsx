import type { ReactNode } from 'react';

type Variant = 'default' | 'danger' | 'primary';

interface IconBtnProps {
  onClick: () => void;
  children: ReactNode;
  variant?: Variant;
  title?: string;
}

const variants: Record<Variant, string> = {
  default: 'bg-slate-800 hover:bg-slate-700 text-slate-300',
  danger: 'bg-slate-800 hover:bg-red-900/50 text-red-400',
  primary: 'bg-orange-600 hover:bg-orange-500 text-white',
};

export function IconBtn({ onClick, children, variant = 'default', title }: IconBtnProps) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded ${variants[variant]} transition-colors`}
    >
      {children}
    </button>
  );
}
