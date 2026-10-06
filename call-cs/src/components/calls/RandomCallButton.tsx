import { motion } from 'framer-motion';
import { Dices } from 'lucide-react';
import { cn } from '@/lib/cn';

/** Botão "Me dá uma call" — secundário, nunca o centro da tela. */
export function RandomCallButton({
  onClick,
  rolling,
  compact = false,
  className,
}: {
  onClick: () => void;
  rolling: boolean;
  compact?: boolean;
  className?: string;
}) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={rolling}
      aria-label="Me dá uma call"
      title="Me dá uma call (R)"
      className={cn(
        'inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-semibold transition-colors disabled:cursor-wait',
        'bg-white/[0.06] text-ink ring-1 ring-inset ring-white/[0.08] hover:bg-white/[0.1]',
        compact ? 'size-11' : 'h-11 px-4 text-sm',
        className,
      )}
    >
      <motion.span
        className="inline-flex text-accent"
        animate={rolling ? { rotate: [0, 120, 240, 360], scale: [1, 1.15, 1] } : { rotate: 0, scale: 1 }}
        transition={rolling ? { duration: 0.45, repeat: Infinity, ease: 'linear' } : { duration: 0.2 }}
      >
        <Dices className="size-[18px]" />
      </motion.span>
      {!compact && <span>{rolling ? 'Sorteando…' : 'Me dá uma call'}</span>}
    </motion.button>
  );
}
