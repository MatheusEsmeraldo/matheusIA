import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { cn } from '@/lib/cn';

interface Props {
  open: boolean;
  onClose: () => void;
  label: string;
  children: ReactNode;
  /** 'detail' = painel grande; 'sheet' = folha menor (filtros, mapas, menu). */
  size?: 'detail' | 'sheet';
  className?: string;
}

/**
 * Overlay responsivo:
 *  - mobile: folha que sobe de baixo;
 *  - md+: painel central.
 * Fecha com Esc e clique fora. Trava o scroll do fundo.
 */
export function Overlay({ open, onClose, label, children, size = 'sheet', className }: Props) {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const lastFocus = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
      lastFocus?.focus?.();
    };
  }, [open, onClose]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center md:p-6">
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            onClick={onClose}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={label}
            tabIndex={-1}
            initial={isDesktop ? { opacity: 0, scale: 0.97, y: 10 } : { y: '100%' }}
            animate={isDesktop ? { opacity: 1, scale: 1, y: 0 } : { y: 0 }}
            exit={isDesktop ? { opacity: 0, scale: 0.98, y: 6 } : { y: '100%' }}
            transition={{ type: 'tween', ease: [0.22, 1, 0.36, 1], duration: isDesktop ? 0.2 : 0.26 }}
            className={cn(
              'relative flex w-full flex-col overflow-hidden bg-frame outline-none',
              'rounded-t-[28px] border-t border-white/10 md:rounded-[30px] md:border',
              size === 'detail' ? 'h-[94dvh] md:h-[min(880px,92dvh)] md:max-w-[1180px]' : 'max-h-[86dvh] md:max-h-[80dvh] md:max-w-[560px]',
              className,
            )}
          >
            {!isDesktop && <div aria-hidden className="mx-auto mt-2.5 h-1 w-10 shrink-0 rounded-full bg-white/20" />}
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
