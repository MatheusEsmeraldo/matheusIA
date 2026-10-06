// Adaptado de TailGrids (MIT) — apps/docs/src/registry/core/skeleton.tsx
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

export function Skeleton({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('h-3 animate-pulse-custom rounded-full bg-skeleton-gradient-50', className)} {...props} />;
}
