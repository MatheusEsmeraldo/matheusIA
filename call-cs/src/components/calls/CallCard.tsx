import { motion } from 'framer-motion';
import { CATEGORY_LABEL } from '@/config/taxonomy';
import { cn } from '@/lib/cn';
import type { CallSummary } from '@/types/domain';
import { CopyCallButton } from './CopyCallButton';
import { FavoriteButton } from './FavoriteButton';
import { MetaTags, SideBadge } from './MetaTags';

interface Props {
  call: CallSummary;
  onOpen: (id: string) => void;
  /** Mostra o nome do mapa (Enciclopédia/Favoritas de vários mapas). */
  mapName?: string;
  index?: number;
  density?: 'match' | 'compact';
}

/**
 * Card de call. Hierarquia: tipo + título (pequeno) → CALL (grande) → metadados (discretos).
 * O card inteiro abre o detalhe; favoritar/copiar ficam por cima do link.
 */
export function CallCard({ call, onOpen, mapName, index = 0, density = 'match' }: Props) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.16, delay: Math.min(index, 6) * 0.02 }}
      className="surface group relative flex flex-col gap-3 rounded-[var(--radius-card)] p-4 transition-colors hover:bg-white/[0.075] sm:p-5"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 pt-1">
          <div className="flex items-center gap-2">
            <SideBadge side={call.side} />
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-faint">
              {CATEGORY_LABEL[call.category]}
              {mapName ? ` · ${mapName}` : ''}
            </span>
          </div>
          <h3 className="mt-1 truncate text-[15px] font-semibold text-muted">{call.title}</h3>
        </div>
        <div className="relative z-10 -mr-1.5 -mt-1 flex items-center">
          <CopyCallButton text={call.shortCall} className="hidden sm:inline-flex" />
          <FavoriteButton callId={call.id} />
        </div>
      </div>

      <p
        className={cn(
          'text-pretty font-semibold leading-[1.22] tracking-[-0.01em] text-ink',
          density === 'match' ? 'text-[21px] sm:text-[23px]' : 'text-lg',
        )}
      >
        {call.shortCall}
      </p>

      <MetaTags call={call} />

      {/* Área clicável do card inteiro */}
      <button
        type="button"
        onClick={() => onOpen(call.id)}
        aria-label={`Abrir detalhes: ${call.title}`}
        className="absolute inset-0 rounded-[var(--radius-card)] focus-visible:outline-offset-[-2px]"
      />
    </motion.article>
  );
}
