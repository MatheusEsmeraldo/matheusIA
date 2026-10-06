import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface Props {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  size?: 'sm' | 'md';
  className?: string;
}

/** Chip selecionável (categorias, tags, regiões). */
export function Chip({ active, onClick, children, size = 'md', className }: Props) {
  return (
    <motion.button
      type="button"
      aria-pressed={active}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        'inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full font-semibold transition-colors duration-150',
        size === 'md' ? 'h-10 px-4 text-sm' : 'h-8 px-3 text-[13px]',
        active
          ? 'bg-ink text-[#0b0d10]'
          : 'bg-white/[0.05] text-muted ring-1 ring-inset ring-white/[0.07] hover:bg-white/[0.08] hover:text-ink',
        className,
      )}
    >
      {children}
    </motion.button>
  );
}
