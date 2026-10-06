import { CATEGORY_LABEL, ECONOMIES, PLAYER_OPTIONS, SIDES } from '@/config/taxonomy';
import { cn } from '@/lib/cn';
import type { CallCategory, Economy, PlayersFilter, Side } from '@/types/domain';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { Chip } from './Chip';

/** Filtros atômicos — reutilizados no Modo Partida e na Enciclopédia. */

const sideDot = (s: Side) => (
  <span className="inline-flex items-center gap-1.5">
    <span className={cn('size-1.5 rounded-full', s === 'TR' ? 'bg-tr' : 'bg-ct')} />
    {s}
  </span>
);

export function SideToggle({
  value,
  onChange,
  size = 'md',
  id = 'side',
  className,
  onClear,
}: {
  value: Side | null;
  onChange: (s: Side) => void;
  size?: 'sm' | 'md' | 'lg';
  id?: string;
  className?: string;
  onClear?: () => void;
}) {
  return (
    <SegmentedControl
      ariaLabel="Lado"
      layoutId={`${id}-pill`}
      size={size}
      value={value}
      onChange={onChange}
      onClear={onClear}
      className={className}
      options={SIDES.map((s) => ({ value: s.value, label: sideDot(s.value), ariaLabel: `${s.label} (${s.hint})` }))}
    />
  );
}

export function EconomyFilter({
  value,
  onChange,
  size = 'md',
  id = 'eco',
  className,
  onClear,
}: {
  value: Economy | null;
  onChange: (e: Economy) => void;
  size?: 'sm' | 'md' | 'lg';
  id?: string;
  className?: string;
  onClear?: () => void;
}) {
  return (
    <SegmentedControl
      ariaLabel="Economia"
      layoutId={`${id}-pill`}
      size={size}
      value={value}
      onChange={onChange}
      onClear={onClear}
      className={className}
      options={ECONOMIES.map((e) => ({ value: e.value, label: e.short, ariaLabel: e.label }))}
    />
  );
}

export function PlayerFilter({
  value,
  onChange,
  size = 'md',
  id = 'players',
  className,
}: {
  value: PlayersFilter;
  onChange: (p: PlayersFilter) => void;
  size?: 'sm' | 'md' | 'lg';
  id?: string;
  className?: string;
}) {
  return (
    <SegmentedControl
      ariaLabel="Jogadores"
      layoutId={`${id}-pill`}
      size={size}
      value={value}
      onChange={onChange}
      className={className}
      options={PLAYER_OPTIONS.map((p) => ({ value: p.value, label: p.label, ariaLabel: p.long }))}
    />
  );
}

/** Categorias em linha rolável. `value` null = todas. */
export function CategoryFilter({
  options,
  value,
  onChange,
  className,
  size = 'md',
}: {
  options: CallCategory[];
  value: CallCategory | null;
  onChange: (c: CallCategory | null) => void;
  className?: string;
  size?: 'sm' | 'md';
}) {
  return (
    <div role="group" aria-label="Tipo da jogada" className={cn('flex gap-2', className)}>
      <Chip size={size} active={value === null} onClick={() => onChange(null)}>
        Todas
      </Chip>
      {options.map((c) => (
        <Chip key={c} size={size} active={value === c} onClick={() => onChange(value === c ? null : c)}>
          {CATEGORY_LABEL[c]}
        </Chip>
      ))}
    </div>
  );
}
