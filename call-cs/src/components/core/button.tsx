// Adaptado de TailGrids (MIT) — apps/docs/src/registry/core/button.tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { Button as AriaButton, type ButtonProps as AriaButtonProps } from 'react-aria-components';
import { cn } from '@/lib/cn';

export const buttonStyles = cva(
  // Call CS: cantos em pílula (rounded-full) e leve "press" no toque.
  'inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-semibold transition outline-none focus-visible:ring-3 data-pressed:scale-[0.97] disabled:pointer-events-none [&>svg]:shrink-0 [&>svg]:text-current',
  {
    variants: {
      variant: { primary: '', danger: '', success: '', ghost: '' },
      appearance: { fill: '', outline: '' },
      iconOnly: { true: '', false: '' },
      size: {
        xs: 'text-xs [&>svg]:size-4',
        sm: 'text-sm [&>svg]:size-4',
        md: 'text-[15px] [&>svg]:size-[18px]',
        lg: 'text-base [&>svg]:size-5',
      },
    },
    compoundVariants: [
      {
        variant: ['primary', 'danger', 'success'],
        appearance: 'fill',
        className: 'disabled:bg-button-disabled-background disabled:text-button-disabled-text',
      },
      {
        variant: ['primary', 'danger', 'success'],
        appearance: 'outline',
        className:
          'border disabled:border-button-outline-disabled-border disabled:bg-button-outline-disabled-background disabled:text-button-outline-disabled-text',
      },
      {
        variant: 'primary',
        appearance: 'fill',
        className:
          'bg-button-primary-background text-button-primary-text hover:bg-button-primary-hover-background focus-visible:ring-button-primary-focus-ring',
      },
      {
        variant: 'primary',
        appearance: 'outline',
        className:
          'border-button-outline-border bg-button-outline-background text-button-outline-text hover:bg-button-outline-hover-background hover:text-button-outline-hover-text focus-visible:ring-button-outline-focus-ring',
      },
      {
        variant: 'danger',
        appearance: 'fill',
        className:
          'bg-button-error-background text-button-error-text hover:bg-button-error-hover-background focus-visible:ring-button-error-focus-ring',
      },
      {
        variant: 'danger',
        appearance: 'outline',
        className:
          'border-button-error-outline-border bg-button-error-outline-background text-button-error-outline-text hover:bg-button-error-outline-hover-background hover:text-button-error-outline-hover-text focus-visible:ring-button-error-outline-focus-ring',
      },
      {
        variant: 'success',
        appearance: 'fill',
        className:
          'bg-button-success-background text-button-success-text hover:bg-button-success-hover-background focus-visible:ring-button-success-focus-ring',
      },
      {
        variant: 'success',
        appearance: 'outline',
        className:
          'border-button-success-outline-border bg-button-success-outline-background text-button-success-outline-text hover:bg-button-success-outline-hover-background focus-visible:ring-button-success-outline-focus-ring',
      },
      {
        variant: 'ghost',
        className:
          'text-button-ghost-text hover:bg-button-ghost-hover-background hover:text-button-ghost-hover-text focus-visible:ring-2 focus-visible:ring-primary-400',
      },
      { iconOnly: true, size: 'xs', className: 'size-8' },
      { iconOnly: true, size: 'sm', className: 'size-9' },
      { iconOnly: true, size: 'md', className: 'size-11' },
      { iconOnly: true, size: 'lg', className: 'size-12' },
      { iconOnly: false, size: ['xs', 'sm'], className: 'h-9 px-3.5' },
      { iconOnly: false, size: 'md', className: 'h-11 px-4' },
      { iconOnly: false, size: 'lg', className: 'h-12 px-5' },
    ],
    defaultVariants: { variant: 'primary', appearance: 'fill', iconOnly: false, size: 'md' },
  },
);

export interface ButtonProps extends Omit<AriaButtonProps, 'isDisabled' | 'isPending' | 'className'>, VariantProps<typeof buttonStyles> {
  className?: string;
  disabled?: boolean;
  pending?: boolean;
}

/** Botão TailGrids (react-aria: use `onPress`). */
export function Button({ variant, appearance, iconOnly, size, children, className, disabled, pending, ...props }: ButtonProps) {
  return (
    <AriaButton
      className={cn(buttonStyles({ variant, appearance, iconOnly, size }), className)}
      isDisabled={disabled}
      isPending={pending}
      {...props}
    >
      {children}
    </AriaButton>
  );
}
