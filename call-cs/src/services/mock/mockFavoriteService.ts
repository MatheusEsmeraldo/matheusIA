import type { FavoriteService } from '../contracts';
import { readJSON, writeJSON } from '@/storage/localStore';
import { mockCalls } from './data/calls';
import { toSummary } from './mockCallService';
import { simulateNetwork } from './mockRuntime';

/**
 * MOCK — favoritos salvos no localStorage do navegador.
 * No backend: favoritos por usuário autenticado (ver BACKEND_CONTRACT.md › Favoritos).
 */
const KEY = 'favorites:v1';

const read = () => readJSON<string[]>(KEY, []);

export const mockFavoriteService: FavoriteService = {
  async getFavoriteIds() {
    await simulateNetwork();
    return read();
  },
  async getFavoriteCalls(mapId) {
    await simulateNetwork();
    const ids = read();
    // Mais recentes primeiro (último favoritado no fim do array).
    return [...ids]
      .reverse()
      .map((id) => mockCalls.find((c) => c.id === id))
      .filter((c): c is NonNullable<typeof c> => !!c && (!mapId || c.mapId === mapId))
      .map(toSummary);
  },
  async addFavorite(callId) {
    await simulateNetwork();
    const ids = read().filter((id) => id !== callId);
    writeJSON(KEY, [...ids, callId]);
  },
  async removeFavorite(callId) {
    await simulateNetwork();
    writeJSON(
      KEY,
      read().filter((id) => id !== callId),
    );
  },
};
