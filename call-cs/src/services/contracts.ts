import type { Call, CallFilters, CallSummary, FilterOptions, GameMap, Paginated, Utility } from '@/types/domain';

/**
 * Contratos dos services. A UI só conhece estas interfaces.
 * Hoje: implementações mock (src/services/mock).
 * Futuro: implementações HTTP (src/services/api) — mesma assinatura.
 * Todas as funções rejeitam com ServiceError em caso de falha.
 */

export interface CallService {
  /** Lista paginada sem filtros. */
  getCalls(page?: number, pageSize?: number): Promise<Paginated<CallSummary>>;
  /** Lista paginada aplicando filtros no servidor. */
  getCallsByFilters(filters: CallFilters): Promise<Paginated<CallSummary>>;
  /** Detalhe completo. Rejeita com NOT_FOUND se não existir. */
  getCallById(id: string): Promise<Call>;
  /** Uma call aleatória compatível com os filtros, ou null. ("Me dá uma call") */
  getRandomCall(filters: CallFilters, excludeId?: string): Promise<Call | null>;
  getUtilitiesByCall(callId: string): Promise<Utility[]>;
  /** Regiões e tags disponíveis (opcionalmente por mapa) para a Enciclopédia. */
  getFilterOptions(mapId?: string): Promise<FilterOptions>;
}

export interface MapService {
  getMaps(): Promise<GameMap[]>;
  getMapById(id: string): Promise<GameMap>;
}

export interface FavoriteService {
  getFavoriteIds(): Promise<string[]>;
  /** Favoritas do usuário, opcionalmente de um mapa. */
  getFavoriteCalls(mapId?: string): Promise<CallSummary[]>;
  addFavorite(callId: string): Promise<void>;
  removeFavorite(callId: string): Promise<void>;
}

export interface Services {
  calls: CallService;
  maps: MapService;
  favorites: FavoriteService;
}
