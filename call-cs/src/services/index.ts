import { env } from '@/config/env';
import type { Services } from './contracts';
import { mockCallService } from './mock/mockCallService';
import { mockFavoriteService } from './mock/mockFavoriteService';
import { mockMapService } from './mock/mockMapService';
import { apiCallService, apiFavoriteService, apiMapService } from './api/apiServices';

/**
 * PONTO ÚNICO DE TROCA mock ↔ API.
 * VITE_DATA_SOURCE=mock (padrão) usa dados locais; =api usa o backend.
 * A UI importa somente `services` daqui (via hooks), nunca os mocks diretamente.
 */
export const services: Services =
  env.dataSource === 'api'
    ? { calls: apiCallService, maps: apiMapService, favorites: apiFavoriteService }
    : { calls: mockCallService, maps: mockMapService, favorites: mockFavoriteService };

export type { Services } from './contracts';
export { ServiceError, friendlyMessage } from './errors';
