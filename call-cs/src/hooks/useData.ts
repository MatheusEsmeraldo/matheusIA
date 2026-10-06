import { services } from '@/services';
import type { CallFilters } from '@/types/domain';
import { useAsync } from './useAsync';

/** Hooks de leitura. Componentes usam estes hooks — nunca os services/mocks diretamente. */

export function useMaps() {
  return useAsync(() => services.maps.getMaps(), []);
}

export function useCalls(filters: CallFilters, enabled = true) {
  const key = JSON.stringify(filters);
  return useAsync(() => services.calls.getCallsByFilters(filters), [key], enabled);
}

export function useCall(id: string | null) {
  return useAsync(() => services.calls.getCallById(id as string), [id], !!id);
}

export function useFavoriteCalls(mapId: string | undefined, version: number, enabled = true) {
  return useAsync(() => services.favorites.getFavoriteCalls(mapId), [mapId, version], enabled);
}

export function useFilterOptions(mapId?: string) {
  return useAsync(() => services.calls.getFilterOptions(mapId), [mapId]);
}
