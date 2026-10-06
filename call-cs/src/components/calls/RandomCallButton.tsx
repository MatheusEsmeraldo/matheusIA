import { motion } from 'framer-motion';
import { Dices } from 'lucide-react';
import { Button } from '@/components/core/button';

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
    <Button appearance="outline" iconOnly={compact} onPress={onClick} pending={rolling} aria-label="Me dá uma call" className={className}>
      <motion.span
        className="inline-flex text-accent"
        animate={rolling ? { rotate: [0, 120, 240, 360], scale: [1, 1.15, 1] } : { rotate: 0, scale: 1 }}
        transition={rolling ? { duration: 0.45, repeat: Infinity, ease: 'linear' } : { duration: 0.2 }}
      >
        <Dices className="size-[18px]" />
      </motion.span>
      {!compact && <span>{rolling ? 'Sorteando…' : 'Me dá uma call'}</span>}
    </Button>
  );
}
