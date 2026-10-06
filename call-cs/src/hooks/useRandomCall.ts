import { useCallback, useState } from 'react';
import { services } from '@/services';
import { useToast } from '@/components/ui/Toast';
import type { CallFilters } from '@/types/domain';

const MIN_SHUFFLE_MS = 450;

/** "Me dá uma call": sorteia uma call compatível com uma microinteração curta. */
export function useRandomCall(filters: CallFilters, onPick: (id: string) => void) {
  const [rolling, setRolling] = useState(false);
  const toast = useToast();
  const key = JSON.stringify(filters);

  const roll = useCallback(
    async (excludeId?: string) => {
      if (rolling) return;
      setRolling(true);
      try {
        const [call] = await Promise.all([
          services.calls.getRandomCall(filters, excludeId),
          new Promise((r) => setTimeout(r, MIN_SHUFFLE_MS)),
        ]);
        if (call) onPick(call.id);
        else toast.show('Nenhuma call para esses filtros.');
      } catch {
        toast.show('Não deu para sortear agora.');
      } finally {
        setRolling(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key, onPick, rolling, toast],
  );

  return { roll, rolling };
}
