import type { CallCategory, Difficulty, Economy, PlayersFilter, Side, Site, ThrowType, UtilityType } from '@/types/domain';

/**
 * Rótulos e ordem de exibição da taxonomia.
 * Valores (chaves) são os mesmos enviados/recebidos da API — só os rótulos são de UI.
 */

export const SIDES: { value: Side; label: string; hint: string }[] = [
  { value: 'TR', label: 'TR', hint: 'Ataque' },
  { value: 'CT', label: 'CT', hint: 'Defesa' },
];

export const ECONOMIES: { value: Economy; label: string; short: string }[] = [
  { value: 'PISTOL', label: 'Pistol', short: 'Pistol' },
  { value: 'ECO', label: 'Eco', short: 'Eco' },
  { value: 'FORCE_BUY', label: 'Force Buy', short: 'Force' },
  { value: 'FULL_BUY', label: 'Full Buy', short: 'Full' },
];

export const PLAYER_OPTIONS: { value: PlayersFilter; label: string; long: string }[] = [
  { value: 'ANY', label: 'Todos', long: 'Qualquer quantidade' },
  { value: 1, label: 'Solo', long: 'Solo' },
  { value: 2, label: '2', long: '2 jogadores' },
  { value: 3, label: '3', long: '3 jogadores' },
  { value: 4, label: '4', long: '4 jogadores' },
  { value: 5, label: '5', long: '5 jogadores' },
];

export const CATEGORY_LABEL: Record<CallCategory, string> = {
  EXECUTE: 'Execute',
  RUSH: 'Rush',
  EXPLODE: 'Explode',
  SPLIT: 'Split',
  FAKE: 'Fake',
  DEFAULT: 'Default',
  SETUP: 'Setup',
  CONTACT: 'Contato',
  MAP_CONTROL: 'Controle de mapa',
  RETAKE: 'Retake',
  ANTI_RUSH: 'Anti-rush',
  STACK: 'Stack',
  PISTOL: 'Pistol',
  INDIVIDUAL: 'Jogada individual',
};

/**
 * Categorias mostradas no Modo Partida por lado. Mantém a tela enxuta:
 * só o que faz sentido para aquele lado aparece como atalho.
 */
export const MATCH_CATEGORIES: Record<Side, CallCategory[]> = {
  TR: ['EXECUTE', 'SPLIT', 'RUSH', 'FAKE', 'DEFAULT', 'CONTACT'],
  CT: ['SETUP', 'RETAKE', 'ANTI_RUSH', 'STACK', 'MAP_CONTROL'],
};

export const ALL_CATEGORIES = Object.keys(CATEGORY_LABEL) as CallCategory[];

export const DIFFICULTIES: { value: Difficulty; label: string }[] = [
  { value: 'EASY', label: 'Fácil' },
  { value: 'MEDIUM', label: 'Média' },
  { value: 'HARD', label: 'Difícil' },
];

export const DIFFICULTY_LABEL: Record<Difficulty, string> = { EASY: 'Fácil', MEDIUM: 'Média', HARD: 'Difícil' };

export const SITES: { value: Site; label: string }[] = [
  { value: 'A', label: 'Bomb A' },
  { value: 'B', label: 'Bomb B' },
  { value: 'MID', label: 'Meio' },
  { value: 'ANY', label: 'Variável' },
];

export const SITE_LABEL: Record<Site, string> = { A: 'A', B: 'B', MID: 'Meio', ANY: 'Variável' };

export const ECONOMY_LABEL: Record<Economy, string> = {
  PISTOL: 'Pistol',
  ECO: 'Eco',
  FORCE_BUY: 'Force Buy',
  FULL_BUY: 'Full Buy',
};

export const UTILITY_LABEL: Record<UtilityType, string> = {
  SMOKE: 'Smoke',
  FLASH: 'Flash',
  MOLOTOV: 'Molotov',
  HE: 'HE',
  DECOY: 'Decoy',
};

export const THROW_LABEL: Record<ThrowType, string> = {
  NORMAL: 'Normal',
  JUMP_THROW: 'Jump throw',
  RUN_THROW: 'Correndo',
  RUN_JUMP_THROW: 'Correndo + pulo',
  RIGHT_CLICK: 'Botão direito',
};

export function playersLabel(n: number): string {
  return n === 1 ? 'Solo' : `${n} players`;
}
