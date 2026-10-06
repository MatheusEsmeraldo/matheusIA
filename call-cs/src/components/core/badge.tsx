// Adaptado de TailGrids (MIT) — apps/docs/src/registry/core/badge.tsx
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

const badgeStyles = cva('inline-flex items-center gap-1.5 rounded-full font-medium [&>svg]:size-3.5', {
  variants: {
    size: {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-xs',
      lg: 'px-3 py-1 text-sm',
    },
    color: {
      gray: 'bg-badge-neutral-background text-badge-neutral-text [&>svg]:text-badge-neutral-icon-color',
      primary: 'bg-badge-primary-background text-badge-primary-text [&>svg]:text-badge-primary-icon-color',
      error: 'bg-badge-error-background text-badge-error-text [&>svg]:text-badge-error-icon-color',
      warning: 'bg-badge-warning-background text-badge-warning-text [&>svg]:text-badge-warning-icon-color',
      success: 'bg-badge-success-background text-badge-success-text [&>svg]:text-badge-success-icon-color',
    },
  },
  defaultVariants: { size: 'md', color: 'gray' },
});

export interface BadgeProps extends Omit<ComponentProps<'span'>, 'color'>, VariantProps<typeof badgeStyles> {}

export function Badge({ className, size, color, ...props }: BadgeProps) {
  return <span className={cn(badgeStyles({ size, color }), className)} {...props} />;
}
