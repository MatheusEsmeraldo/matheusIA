import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface SegmentOption<T extends string | number> {
  value: T;
  label: ReactNode;
  /** Rótulo acessível quando `label` não é texto. */
  ariaLabel?: string;
}

interface Props<T extends string | number> {
  options: SegmentOption<T>[];
  value: T | null;
  onChange: (value: T) => void;
  /** Precisa ser único na tela (anima a “pílula” selecionada). */
  layoutId: string;
  ariaLabel: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  /** Permite desmarcar tocando na opção ativa. */
  onClear?: () => void;
}

const SIZE = {
  sm: 'h-9 px-1 text-[13px]',
  md: 'h-11 px-2 text-sm',
  lg: 'h-14 px-2 text-base',
};

/**
 * Controle segmentado: uma interação para trocar de opção.
 * Usado em lado (TR/CT), economia e jogadores.
 */
export function SegmentedControl<T extends string | number>({
  options,
  value,
  onChange,
  layoutId,
  ariaLabel,
  size = 'md',
  className,
  onClear,
}: Props<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn('flex rounded-full bg-black/30 p-1 ring-1 ring-inset ring-white/[0.06]', className)}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={String(opt.value)}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={opt.ariaLabel}
            onClick={() => (active && onClear ? onClear() : onChange(opt.value))}
            className={cn(
              'relative flex min-w-0 flex-1 items-center justify-center rounded-full font-semibold transition-colors duration-150',
              SIZE[size],
              active ? 'text-[#0b0d10]' : 'text-muted hover:text-ink',
            )}
          >
            {active && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 rounded-full bg-ink shadow-[0_6px_20px_-8px_rgba(255,255,255,0.45)]"
                transition={{ type: 'spring', stiffness: 700, damping: 45 }}
              />
            )}
            <span className="relative z-10 truncate">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
