import type { ReactNode } from 'react';
import type { AsyncState } from '@/hooks/useAsync';
import { cn } from '@/lib/cn';
import type { CallSummary, GameMap } from '@/types/domain';
import { EmptyState, ErrorState, LoadingState } from '@/components/states/States';
import { CallCard } from './CallCard';

interface Props {
  state: Pick<AsyncState<CallSummary[]>, 'status' | 'data' | 'error' | 'isRefreshing' | 'reload'>;
  onOpen: (id: string) => void;
  empty?: ReactNode;
  className?: string;
  maps?: GameMap[];
  showMapName?: boolean;
  density?: 'match' | 'compact';
}

/** Lista de calls com os quatro estados: loading, error, empty, success. */
export function CallList({ state, onOpen, empty, className, maps, showMapName, density }: Props) {
  if (state.status === 'loading' || state.status === 'idle') return <LoadingState className={className} count={3} />;
  if (state.status === 'error') return <ErrorState error={state.error} onRetry={state.reload} />;
  const items = state.data ?? [];
  if (items.length === 0) return <>{empty ?? <EmptyState />}</>;
  const mapName = (id: string) => maps?.find((m) => m.id === id)?.name;

  return (
    <div
      className={cn('grid content-start gap-3 transition-opacity duration-150', state.isRefreshing && 'opacity-60', className)}
      aria-live="polite"
    >
      {items.map((c, i) => (
        <CallCard key={c.id} call={c} index={i} onOpen={onOpen} density={density} mapName={showMapName ? mapName(c.mapId) : undefined} />
      ))}
    </div>
  );
}
