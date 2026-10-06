// Adaptado de TailGrids (MIT) — apps/docs/src/registry/core/input.tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { Input as AriaInput, type InputProps as AriaInputProps } from 'react-aria-components';
import { cn } from '@/lib/cn';

const inputStyles = cva(
  'peer max-w-full rounded-full border bg-input-background px-4 text-title-50 outline-none placeholder:text-input-placeholder-text focus:ring-4 disabled:cursor-not-allowed disabled:border-base-100 disabled:text-input-disabled-text disabled:placeholder:text-input-disabled-text',
  {
    variants: {
      state: {
        default: 'border-base-300 focus:border-input-primary-focus-border focus:ring-input-primary-focus-border/20',
        error: 'border-input-error-focus-border focus:ring-input-error-focus-border/20',
        success: 'border-input-success-focus-border focus:ring-input-success-focus-border/20',
      },
    },
    defaultVariants: { state: 'default' },
  },
);

export interface InputProps extends Omit<AriaInputProps, 'className'>, VariantProps<typeof inputStyles> {
  className?: string;
}

export function Input({ state, className, ...props }: InputProps) {
  return <AriaInput className={cn(inputStyles({ state }), className)} {...props} />;
}
