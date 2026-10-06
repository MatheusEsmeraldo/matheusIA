import type { CallCategory, Economy, PlayersFilter, Side } from '@/types/domain';
import { readJSON, writeJSON } from './localStore';

/** Preferências do Modo Partida (ficam no navegador do jogador). */
export interface MatchPreferences {
  mapId: string | null;
  side: Side;
  economy: Economy;
  players: PlayersFilter;
  category: CallCategory | null;
}

const KEY = 'prefs:match:v1';

export const DEFAULT_MATCH_PREFS: MatchPreferences = {
  mapId: null,
  side: 'TR',
  economy: 'FULL_BUY',
  players: 'ANY',
  category: null,
};

export function loadMatchPrefs(): MatchPreferences {
  return { ...DEFAULT_MATCH_PREFS, ...readJSON<Partial<MatchPreferences>>(KEY, {}) };
}

export function saveMatchPrefs(prefs: MatchPreferences): void {
  writeJSON(KEY, prefs);
}
