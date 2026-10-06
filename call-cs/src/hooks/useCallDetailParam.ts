import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * A call aberta fica na URL (?call=id) — permite voltar com o botão do
 * navegador/celular e compartilhar o link de uma call.
 */
export function useCallDetailParam() {
  const [params, setParams] = useSearchParams();
  const callId = params.get('call');
  const random = params.get('rnd') === '1';

  const open = useCallback(
    (id: string, opts: { random?: boolean } = {}) => {
      setParams(
        (p) => {
          const next = new URLSearchParams(p);
          next.set('call', id);
          if (opts.random) next.set('rnd', '1');
          else next.delete('rnd');
          return next;
        },
        // Sorteio seguido substitui o histórico em vez de empilhar.
        { replace: !!callId && !!opts.random },
      );
    },
    [setParams, callId],
  );

  const close = useCallback(() => {
    setParams((p) => {
      const next = new URLSearchParams(p);
      next.delete('call');
      next.delete('rnd');
      return next;
    });
  }, [setParams]);

  return { callId, random, open, close };
}
