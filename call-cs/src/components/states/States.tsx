import { motion } from 'framer-motion';
import { RotateCw, SearchX, WifiOff } from 'lucide-react';
import type { ReactNode } from 'react';
import { friendlyMessage, type ServiceError } from '@/services';
import { cn } from '@/lib/cn';

/** Skeleton discreto com o mesmo formato do CallCard. */
export function LoadingState({ count = 4, className }: { count?: number; className?: string }) {
  return (
    <div className={cn('grid gap-3', className)} aria-busy="true" aria-label="Carregando calls">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="surface rounded-[var(--radius-card)] p-5">
          <div className="h-3 w-24 animate-pulse rounded-full bg-white/[0.07]" />
          <div className="mt-2 h-3.5 w-36 animate-pulse rounded-full bg-white/[0.05]" />
          <div className="mt-4 h-5 w-full animate-pulse rounded-full bg-white/[0.08]" />
          <div className="mt-2 h-5 w-3/4 animate-pulse rounded-full bg-white/[0.08]" />
          <div className="mt-4 flex gap-1.5">
            {[56, 64, 48].map((w) => (
              <div key={w} className="h-6 animate-pulse rounded-full bg-white/[0.05]" style={{ width: w }} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function StateBox({
  icon,
  title,
  text,
  action,
  className,
}: {
  icon: ReactNode;
  title: string;
  text?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('surface flex flex-col items-center rounded-[var(--radius-card)] px-6 py-10 text-center', className)}
    >
      <div className="grid size-12 place-items-center rounded-full bg-white/[0.06] text-muted">{icon}</div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      {text && <p className="mt-1 max-w-sm text-sm text-muted">{text}</p>}
      {action && <div className="mt-5 flex flex-wrap justify-center gap-2">{action}</div>}
    </motion.div>
  );
}

export function ErrorState({ error, onRetry, className }: { error: ServiceError | null; onRetry: () => void; className?: string }) {
  return (
    <StateBox
      className={className}
      icon={<WifiOff className="size-5" />}
      title="Não deu para carregar"
      text={error ? friendlyMessage(error) : undefined}
      action={
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-[#0b0d10]"
        >
          <RotateCw className="size-4" /> Tentar novamente
        </button>
      }
    />
  );
}

export function EmptyState({
  title = 'Nenhuma call encontrada',
  text = 'Tente mudar a economia, o número de jogadores ou o tipo da jogada.',
  actions,
  className,
}: {
  title?: string;
  text?: string;
  actions?: ReactNode;
  className?: string;
}) {
  return <StateBox className={className} icon={<SearchX className="size-5" />} title={title} text={text} action={actions} />;
}

export function GhostButton({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-10 items-center rounded-full bg-white/[0.06] px-4 text-sm font-semibold text-ink ring-1 ring-inset ring-white/[0.08] hover:bg-white/[0.1]"
    >
      {children}
    </button>
  );
}
