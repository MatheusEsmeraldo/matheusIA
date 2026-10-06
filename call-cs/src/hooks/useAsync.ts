import { useCallback, useEffect, useRef, useState, type DependencyList } from 'react';
import { ServiceError } from '@/services';
import { toServiceError } from '@/services/errors';

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  status: AsyncStatus;
  data: T | undefined;
  error: ServiceError | null;
  /** true quando já existe dado na tela e um novo pedido está em andamento. */
  isRefreshing: boolean;
  reload: () => void;
}

/**
 * Executa uma chamada de service e expõe loading / error / success.
 * Mantém o dado anterior enquanto recarrega (troca de filtro não pisca skeleton)
 * e ignora respostas atrasadas de pedidos antigos.
 */
export function useAsync<T>(fn: () => Promise<T>, deps: DependencyList, enabled = true): AsyncState<T> {
  const [state, setState] = useState<Omit<AsyncState<T>, 'reload'>>({
    status: enabled ? 'loading' : 'idle',
    data: undefined,
    error: null,
    isRefreshing: false,
  });
  const reqId = useRef(0);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    const id = ++reqId.current;
    setState((s) => ({
      ...s,
      status: s.data === undefined ? 'loading' : s.status,
      isRefreshing: s.data !== undefined,
      error: null,
    }));
    fn().then(
      (data) => {
        if (id === reqId.current) setState({ status: 'success', data, error: null, isRefreshing: false });
      },
      (err: unknown) => {
        if (id === reqId.current) setState({ status: 'error', data: undefined, error: toServiceError(err), isRefreshing: false });
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, nonce, enabled]);

  const reload = useCallback(() => {
    setState((s) => ({ ...s, status: 'loading', data: undefined, error: null }));
    setNonce((n) => n + 1);
  }, []);

  return { ...state, reload };
}
