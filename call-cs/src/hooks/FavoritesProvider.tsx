import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { services } from '@/services';
import { useToast } from '@/components/ui/Toast';

interface FavoritesContextValue {
  ids: Set<string>;
  ready: boolean;
  isFavorite: (id: string) => boolean;
  toggle: (id: string) => Promise<void>;
  /** Muda a cada alteração — permite recarregar listas de favoritas. */
  version: number;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

/**
 * Estado global de favoritas com atualização otimista e rollback em caso de erro.
 * A fonte é services.favorites (localStorage hoje, API no futuro).
 */
export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<Set<string>>(new Set());
  const [ready, setReady] = useState(false);
  const [version, setVersion] = useState(0);
  const toast = useToast();

  useEffect(() => {
    services.favorites
      .getFavoriteIds()
      .then((list) => setIds(new Set(list)))
      .catch(() => {
        /* sem favoritos: a UI segue funcionando */
      })
      .finally(() => setReady(true));
  }, []);

  const toggle = useCallback(
    async (id: string) => {
      const wasFav = ids.has(id);
      const apply = (fav: boolean) =>
        setIds((prev) => {
          const next = new Set(prev);
          if (fav) next.add(id);
          else next.delete(id);
          return next;
        });
      apply(!wasFav);
      try {
        if (wasFav) await services.favorites.removeFavorite(id);
        else await services.favorites.addFavorite(id);
        setVersion((v) => v + 1);
      } catch {
        apply(wasFav);
        toast.show('Não foi possível salvar a favorita.');
      }
    },
    [ids, toast],
  );

  const value = useMemo<FavoritesContextValue>(
    () => ({ ids, ready, isFavorite: (id) => ids.has(id), toggle, version }),
    [ids, ready, toggle, version],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites precisa do FavoritesProvider');
  return ctx;
}
