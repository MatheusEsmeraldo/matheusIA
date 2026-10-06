import type { Call, CallFilters, CallSummary, FilterOptions, GameMap, Paginated, Utility } from '@/types/domain';
import type { CallService, FavoriteService, MapService } from '../contracts';
import { request } from './httpClient';

/**
 * Implementações HTTP dos services — ESQUELETO para o backend futuro.
 * Não são usadas enquanto VITE_DATA_SOURCE=mock. Endpoints em BACKEND_CONTRACT.md.
 */

interface PageMeta {
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

function filtersToQuery(f: CallFilters) {
  return {
    mapId: f.mapId,
    side: f.side,
    economy: f.economy,
    players: f.players === 'ANY' ? undefined : f.players,
    category: f.categories,
    site: f.site,
    region: f.region,
    difficulty: f.difficulty,
    tags: f.tags,
    search: f.search,
    page: f.page,
    pageSize: f.pageSize,
  };
}

async function list(query: ReturnType<typeof filtersToQuery>): Promise<Paginated<CallSummary>> {
  const res = await request<CallSummary[], PageMeta>('GET', '/calls', { query });
  const meta = res.meta ?? { total: res.data.length, page: 1, pageSize: res.data.length, hasMore: false };
  return { items: res.data, ...meta };
}

export const apiCallService: CallService = {
  getCalls: (page, pageSize) => list({ ...filtersToQuery({}), page, pageSize }),
  getCallsByFilters: (filters) => list(filtersToQuery(filters)),
  getCallById: async (id) => (await request<Call>('GET', `/calls/${encodeURIComponent(id)}`)).data,
  getRandomCall: async (filters, excludeId) =>
    (await request<Call | null>('GET', '/calls/random', { query: { ...filtersToQuery(filters), excludeId } })).data,
  getUtilitiesByCall: async (callId) => (await request<Utility[]>('GET', `/calls/${encodeURIComponent(callId)}/utilities`)).data,
  getFilterOptions: async (mapId) => (await request<FilterOptions>('GET', '/calls/filter-options', { query: { mapId } })).data,
};

export const apiMapService: MapService = {
  getMaps: async () => (await request<GameMap[]>('GET', '/maps')).data,
  getMapById: async (id) => (await request<GameMap>('GET', `/maps/${encodeURIComponent(id)}`)).data,
};

export const apiFavoriteService: FavoriteService = {
  getFavoriteIds: async () => (await request<string[]>('GET', '/me/favorites/ids')).data,
  getFavoriteCalls: async (mapId) => (await request<CallSummary[]>('GET', '/me/favorites', { query: { mapId } })).data,
  addFavorite: async (callId) => {
    await request<void>('PUT', `/me/favorites/${encodeURIComponent(callId)}`);
  },
  removeFavorite: async (callId) => {
    await request<void>('DELETE', `/me/favorites/${encodeURIComponent(callId)}`);
  },
};
