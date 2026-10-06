import { motion, type HTMLMotionProps } from 'framer-motion';
import { forwardRef } from 'react';
import { cn } from '@/lib/cn';

interface Props extends HTMLMotionProps<'button'> {
  label: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'ghost' | 'surface' | 'solid';
}

const SIZE = { sm: 'size-9', md: 'size-11', lg: 'size-12' };
const VARIANT = {
  ghost: 'text-muted hover:text-ink hover:bg-white/[0.06]',
  surface: 'surface text-ink hover:bg-white/[0.09]',
  solid: 'bg-ink text-[#0b0d10] hover:bg-white',
};

/** Botão circular de ícone (alvo de toque ≥ 36px). */
export const IconButton = forwardRef<HTMLButtonElement, Props>(function IconButton(
  { label, size = 'md', variant = 'surface', className, children, ...rest },
  ref,
) {
  return (
    <motion.button
      ref={ref}
      type="button"
      aria-label={label}
      title={label}
      whileTap={{ scale: 0.92 }}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full transition-colors',
        SIZE[size],
        VARIANT[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </motion.button>
  );
});
