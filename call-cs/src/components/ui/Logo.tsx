import { cn } from '@/lib/cn';

/** Marca Call CS: mira minimalista + wordmark. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn('size-6', className)} aria-hidden>
      <circle cx="16" cy="16" r="8.5" fill="none" stroke="currentColor" strokeWidth="2.4" />
      <path d="M16 3.5v6M16 22.5v6M3.5 16h6M22.5 16h6" stroke="var(--color-accent)" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2 font-bold tracking-tight', className)}>
      <LogoMark />
      <span>
        CALL<span className="text-accent"> CS</span>
      </span>
    </span>
  );
}
