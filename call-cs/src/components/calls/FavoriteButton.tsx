import { AnimatePresence, motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useFavorites } from '@/hooks/FavoritesProvider';
import { cn } from '@/lib/cn';

/** Estrela de favorito com feedback imediato (otimista). */
export function FavoriteButton({ callId, size = 'md', className }: { callId: string; size?: 'sm' | 'md'; className?: string }) {
  const { isFavorite, toggle } = useFavorites();
  const fav = isFavorite(callId);
  return (
    <motion.button
      type="button"
      aria-pressed={fav}
      aria-label={fav ? 'Remover das favoritas' : 'Favoritar'}
      title={fav ? 'Remover das favoritas' : 'Favoritar'}
      whileTap={{ scale: 0.85 }}
      onClick={(e) => {
        e.stopPropagation();
        void toggle(callId);
      }}
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center rounded-full transition-colors',
        size === 'md' ? 'size-11' : 'size-9',
        fav ? 'text-flash' : 'text-faint hover:bg-white/[0.06] hover:text-ink',
        className,
      )}
    >
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={fav ? 'on' : 'off'}
          initial={{ scale: 0.4, rotate: -30, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          exit={{ scale: 0.4, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 700, damping: 30 }}
          className="inline-flex"
        >
          <Star className={size === 'md' ? 'size-5' : 'size-[18px]'} fill={fav ? 'currentColor' : 'none'} strokeWidth={2} />
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
