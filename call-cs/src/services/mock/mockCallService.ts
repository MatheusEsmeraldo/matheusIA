import type { Call, CallFilters, CallSummary, Paginated } from '@/types/domain';
import type { CallService } from '../contracts';
import { ServiceError } from '../errors';
import { mockCalls } from './data/calls';
import { mockMode, simulateNetwork } from './mockRuntime';

/**
 * MOCK — implementação local do CallService.
 * A lógica de filtro aqui documenta o comportamento esperado do backend
 * (ver BACKEND_CONTRACT.md › "Regras de filtro").
 */

export function toSummary(c: Call): CallSummary {
  return {
    id: c.id,
    mapId: c.mapId,
    side: c.side,
    economy: c.economy,
    category: c.category,
    playersRequired: c.playersRequired,
    title: c.title,
    shortCall: c.shortCall,
    difficulty: c.difficulty,
    site: c.site,
    tags: c.tags,
    updatedAt: c.updatedAt,
  };
}

const normalize = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

export function matchesFilters(c: Call, f: CallFilters): boolean {
  if (f.mapId && c.mapId !== f.mapId) return false;
  if (f.side && c.side !== f.side) return false;
  if (f.economy && c.economy !== f.economy) return false;
  if (f.players && f.players !== 'ANY' && c.playersRequired !== f.players) return false;
  if (f.categories && f.categories.length > 0 && !f.categories.includes(c.category)) return false;
  if (f.site && c.site !== f.site) return false;
  if (f.region && !c.regions.includes(f.region)) return false;
  if (f.difficulty && c.difficulty !== f.difficulty) return false;
  if (f.tags && f.tags.length > 0 && !f.tags.every((t) => c.tags.includes(t))) return false;
  if (f.search) {
    const q = normalize(f.search.trim());
    const hay = normalize([c.title, c.shortCall, c.objective, ...c.regions, ...c.tags].join(' '));
    if (q && !hay.includes(q)) return false;
  }
  return true;
}

function source(): Call[] {
  return mockMode() === 'empty' ? [] : mockCalls;
}

function paginate<T>(items: T[], page = 1, pageSize = 50): Paginated<T> {
  const start = (page - 1) * pageSize;
  const slice = items.slice(start, start + pageSize);
  return { items: slice, total: items.length, page, pageSize, hasMore: start + pageSize < items.length };
}

// Ordem padrão: dificuldade (mais fácil primeiro) e depois mais recente.
const DIFF_ORDER = { EASY: 0, MEDIUM: 1, HARD: 2 } as const;
function sortCalls(a: Call, b: Call) {
  return DIFF_ORDER[a.difficulty] - DIFF_ORDER[b.difficulty] || b.updatedAt.localeCompare(a.updatedAt);
}

export const mockCallService: CallService = {
  async getCalls(page, pageSize) {
    await simulateNetwork();
    return paginate([...source()].sort(sortCalls).map(toSummary), page, pageSize);
  },

  async getCallsByFilters(filters) {
    await simulateNetwork();
    const list = source()
      .filter((c) => matchesFilters(c, filters))
      .sort(sortCalls)
      .map(toSummary);
    return paginate(list, filters.page, filters.pageSize);
  },

  async getCallById(id) {
    await simulateNetwork();
    const found = source().find((c) => c.id === id);
    if (!found) throw new ServiceError('NOT_FOUND', `Call ${id} não encontrada.`, 404);
    return structuredClone(found);
  },

  async getRandomCall(filters, excludeId) {
    await simulateNetwork();
    const pool = source().filter((c) => matchesFilters(c, filters));
    const candidates = pool.length > 1 && excludeId ? pool.filter((c) => c.id !== excludeId) : pool;
    if (candidates.length === 0) return null;
    return structuredClone(candidates[Math.floor(Math.random() * candidates.length)]);
  },

  async getUtilitiesByCall(callId) {
    const call = await this.getCallById(callId);
    return call.utilities;
  },

  async getFilterOptions(mapId) {
    await simulateNetwork();
    const pool = source().filter((c) => !mapId || c.mapId === mapId);
    const regions = [...new Set(pool.flatMap((c) => c.regions))].sort((a, b) => a.localeCompare(b));
    const tags = [...new Set(pool.flatMap((c) => c.tags))].sort((a, b) => a.localeCompare(b));
    return { regions, tags };
  },
};
