import type { ReactNode } from 'react';
import { Button, type ButtonProps } from '@/components/core/button';

interface Props extends Omit<ButtonProps, 'variant' | 'appearance' | 'iconOnly' | 'size' | 'children'> {
  label: string;
  size?: 'sm' | 'md' | 'lg';
  /** ghost = sem fundo; surface = vidro (outline TailGrids); solid = preenchido. */
  variant?: 'ghost' | 'surface' | 'solid';
  children: ReactNode;
}

const MAP = {
  ghost: { variant: 'ghost', appearance: 'fill' },
  surface: { variant: 'primary', appearance: 'outline' },
  solid: { variant: 'primary', appearance: 'fill' },
} as const;

/** Botão circular de ícone — Button TailGrids com `iconOnly`. */
export function IconButton({ label, size = 'md', variant = 'surface', children, ...rest }: Props) {
  return (
    <Button aria-label={label} iconOnly size={size} {...MAP[variant]} {...rest}>
      {children}
    </Button>
  );
}
