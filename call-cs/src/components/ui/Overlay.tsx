import type { ReactNode } from 'react';
import { Dialog, Modal, ModalOverlay } from 'react-aria-components';
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
 * Overlay responsivo no padrão Sheet/Modal do TailGrids (react-aria-components):
 * foco preso no painel, Esc e clique fora fecham, scroll do fundo travado.
 *  - mobile: folha que sobe de baixo;
 *  - md+: painel central.
 */
export function Overlay({ open, onClose, label, children, size = 'sheet', className }: Props) {
  return (
    <ModalOverlay
      isOpen={open}
      onOpenChange={(isOpen) => !isOpen && onClose()}
      isDismissable
      className={cn(
        'fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm md:items-center md:p-6',
        'transition-opacity duration-200 data-entering:opacity-0 data-exiting:opacity-0',
      )}
    >
      <Modal
        className={cn(
          'relative flex w-full flex-col overflow-hidden bg-background-100 outline-none',
          'rounded-t-[28px] border-t border-base-300 md:rounded-[30px] md:border',
          'transition duration-[260ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
          'data-entering:translate-y-full data-exiting:translate-y-full',
          'md:data-entering:translate-y-2 md:data-entering:scale-[0.97] md:data-entering:opacity-0',
          'md:data-exiting:translate-y-1 md:data-exiting:opacity-0',
          size === 'detail' ? 'h-[94dvh] md:h-[min(880px,92dvh)] md:max-w-[1180px]' : 'max-h-[86dvh] md:max-h-[80dvh] md:max-w-[560px]',
          className,
        )}
      >
        <Dialog aria-label={label} className="flex min-h-0 flex-1 flex-col outline-none">
          <div aria-hidden className="mx-auto mt-2.5 h-1 w-10 shrink-0 rounded-full bg-white/20 md:hidden" />
          {children}
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
