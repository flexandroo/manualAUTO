import type { ReactNode } from 'react';

type Variant = 'default' | 'danger' | 'primary';

interface IconBtnProps {
  onClick: () => void;
  children: ReactNode;
  variant?: Variant;
  title?: string;
}

const variants: Record<Variant, string> = {
  default: 'bg-stone-100 hover:bg-stone-200 text-stone-600',
  danger: 'bg-stone-100 hover:bg-red-900/50 text-red-400',
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
