import { motion } from 'framer-motion';
import { Check, Copy } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/cn';

/** Copia a call (útil para colar no chat do jogo). */
export function CopyCallButton({ text, className, withLabel = false }: { text: string; className?: string; withLabel?: boolean }) {
  const [done, setDone] = useState(false);
  const copy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* clipboard bloqueado: ignora */
    }
    setDone(true);
    window.setTimeout(() => setDone(false), 1200);
  };
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.9 }}
      onClick={copy}
      aria-label="Copiar call"
      title="Copiar call"
      className={cn(
        'inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full text-faint transition-colors hover:bg-white/[0.06] hover:text-ink',
        withLabel ? 'h-9 px-3 text-[13px] font-semibold' : 'size-9',
        done && 'text-accent',
        className,
      )}
    >
      {done ? <Check className="size-4" /> : <Copy className="size-4" />}
      {withLabel && (done ? 'Copiada' : 'Copiar')}
    </motion.button>
  );
}
