import { CATEGORY_LABEL, DIFFICULTY_LABEL, ECONOMY_LABEL, SITE_LABEL, playersLabel } from '@/config/taxonomy';
import { cn } from '@/lib/cn';
import type { CallSummary } from '@/types/domain';

export function SideBadge({ side, className }: { side: CallSummary['side']; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em]',
        side === 'TR' ? 'text-tr' : 'text-ct',
        className,
      )}
    >
      <span className={cn('size-1.5 rounded-full', side === 'TR' ? 'bg-tr' : 'bg-ct')} />
      {side}
    </span>
  );
}

/** Metadados secundários: discretos, nunca competem com a call. */
export function MetaTags({
  call,
  show = ['economy', 'players', 'site', 'difficulty'],
  className,
}: {
  call: CallSummary;
  show?: Array<'economy' | 'players' | 'site' | 'difficulty' | 'category'>;
  className?: string;
}) {
  const parts: Record<string, string> = {
    category: CATEGORY_LABEL[call.category],
    economy: ECONOMY_LABEL[call.economy],
    players: playersLabel(call.playersRequired),
    site: call.site === 'MID' || call.site === 'ANY' ? SITE_LABEL[call.site] : `Bomb ${call.site}`,
    difficulty: DIFFICULTY_LABEL[call.difficulty],
  };
  return (
    <ul className={cn('flex flex-wrap items-center gap-1.5', className)}>
      {show.map((k) => (
        <li key={k} className="rounded-full bg-white/[0.05] px-2.5 py-1 text-xs font-medium text-muted">
          {parts[k]}
        </li>
      ))}
    </ul>
  );
}
