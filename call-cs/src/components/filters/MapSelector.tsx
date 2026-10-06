import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';
import type { GameMap } from '@/types/domain';
import { MapThumb } from '@/components/calls/TacticalMap';

/** Grade de mapas (entrada e troca rápida). Dados vêm de services.maps. */
export function MapGrid({
  maps,
  selectedId,
  onSelect,
  className,
}: {
  maps: GameMap[];
  selectedId?: string | null;
  onSelect: (map: GameMap) => void;
  className?: string;
}) {
  return (
    <div className={cn('grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4', className)}>
      {maps.map((m, i) => {
        const active = m.id === selectedId;
        return (
          <motion.button
            key={m.id}
            type="button"
            onClick={() => onSelect(m)}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.025, duration: 0.2 }}
            whileTap={{ scale: 0.97 }}
            aria-pressed={active}
            className={cn(
              'group relative flex aspect-[4/3] flex-col justify-between overflow-hidden rounded-[22px] p-4 text-left transition-colors',
              active ? 'surface-strong ring-2 ring-ink/80' : 'surface hover:bg-white/[0.08]',
            )}
          >
            <MapThumb
              map={m}
              className="absolute -right-2 top-1/2 h-[118%] w-auto -translate-y-1/2 opacity-50 transition-opacity group-hover:opacity-90"
            />
            <span className="relative label">{active ? 'Selecionado' : `Mapa ${String(m.order).padStart(2, '0')}`}</span>
            <span className="relative text-xl font-semibold tracking-tight">{m.name}</span>
          </motion.button>
        );
      })}
    </div>
  );
}

/** Abas de mapa (header desktop) — mesma ideia das abas de cômodo da referência visual. */
export function MapTabs({ maps, selectedId, onSelect }: { maps: GameMap[]; selectedId: string; onSelect: (m: GameMap) => void }) {
  return (
    <nav aria-label="Mapas" className="scrollbar-none flex items-center gap-1 overflow-x-auto">
      {maps.map((m) => {
        const active = m.id === selectedId;
        return (
          <button
            key={m.id}
            type="button"
            onClick={() => onSelect(m)}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'relative whitespace-nowrap rounded-full px-3.5 py-2 text-[17px] font-medium tracking-tight transition-colors',
              active ? 'text-ink' : 'text-faint hover:text-muted',
            )}
          >
            {m.name}
            {active && (
              <motion.span
                layoutId="map-tab-underline"
                className="absolute inset-x-3.5 -bottom-0.5 h-0.5 rounded-full bg-accent"
                transition={{ type: 'spring', stiffness: 600, damping: 40 }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}
