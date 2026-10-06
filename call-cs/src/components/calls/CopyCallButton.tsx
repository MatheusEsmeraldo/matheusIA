import { Check, Copy } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/cn';
import { Button } from '@/components/core/button';

/** Copia a call (útil para colar no chat do jogo). */
export function CopyCallButton({ text, className, withLabel = false }: { text: string; className?: string; withLabel?: boolean }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* clipboard bloqueado: ignora */
    }
    setDone(true);
    window.setTimeout(() => setDone(false), 1200);
  };
  return (
    <Button
      variant="ghost"
      size="sm"
      iconOnly={!withLabel}
      onPress={copy}
      aria-label="Copiar call"
      className={cn(done && 'text-accent hover:text-accent', className)}
    >
      {done ? <Check /> : <Copy />}
      {withLabel && (done ? 'Copiada' : 'Copiar')}
    </Button>
  );
}
