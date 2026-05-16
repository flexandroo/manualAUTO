import type { ReactNode } from 'react';

type Variant = 'default' | 'danger' | 'primary';

interface IconBtnProps {
  onClick: () => void;
  children: ReactNode;
  variant?: Variant;
  title?: string;
}

const variants: Record<Variant, string> = {
  default: 'bg-stone-200 hover:bg-stone-300 border border-stone-300 text-stone-700',
  danger: 'bg-stone-200 hover:bg-red-100 border border-stone-300 hover:border-red-400 text-red-600',
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
