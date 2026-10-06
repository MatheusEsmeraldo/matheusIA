/**
 * Entidades de domínio do Call CS.
 * Este arquivo é a fonte da verdade dos tipos compartilhados entre UI, services e
 * (futuramente) o backend. Ver BACKEND_CONTRACT.md para o formato JSON equivalente.
 */

export type Side = 'TR' | 'CT';

export type Economy = 'PISTOL' | 'ECO' | 'FORCE_BUY' | 'FULL_BUY';

export type CallCategory =
  | 'EXECUTE'
  | 'RUSH'
  | 'EXPLODE'
  | 'SPLIT'
  | 'FAKE'
  | 'DEFAULT'
  | 'SETUP'
  | 'CONTACT'
  | 'MAP_CONTROL'
  | 'RETAKE'
  | 'ANTI_RUSH'
  | 'STACK'
  | 'PISTOL'
  | 'INDIVIDUAL';

export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

/** Bombsite / área alvo principal da call. */
export type Site = 'A' | 'B' | 'MID' | 'ANY';

/** Quantidade de jogadores para a qual a call foi desenhada. */
export type PlayerCount = 1 | 2 | 3 | 4 | 5;

export type UtilityType = 'SMOKE' | 'FLASH' | 'MOLOTOV' | 'HE' | 'DECOY';

export type ThrowType = 'NORMAL' | 'JUMP_THROW' | 'RUN_THROW' | 'RUN_JUMP_THROW' | 'RIGHT_CLICK';

/** Ponto normalizado (0–100) no mapa esquemático. */
export interface MapPoint {
  x: number;
  y: number;
}

export interface MapZone extends MapPoint {
  id: string;
  label: string;
}

/** Layout esquemático usado pelo TacticalMap enquanto não houver radar real. */
export interface MapLayout {
  sites: Partial<Record<'A' | 'B', MapPoint>>;
  zones: MapZone[];
}

/** Camada do radar vetorial (ex.: andar superior/inferior da Nuke). */
export interface MapRadarLayer {
  id: string;
  label: string;
  /** SVG path (viewBox 0 0 100 100, fill-rule evenodd) das áreas jogáveis. */
  path: string;
}

/** Radar vetorial do mapa, desenhado na identidade Call CS. */
export interface MapRadar {
  /** A primeira camada é a principal; as demais são desenhadas por baixo, tracejadas. */
  layers: MapRadarLayer[];
}

export interface GameMap {
  id: string;
  name: string;
  slug: string;
  /** URL de imagem/radar. `null` no protótipo. */
  image: string | null;
  /** Se o mapa está no pool ativo. Mapas inativos podem ser ocultados da seleção rápida. */
  active: boolean;
  /** Ordem de exibição. */
  order: number;
  layout: MapLayout | null;
  /** Radar vetorial. `null` = usa só o layout esquemático. */
  radar: MapRadar | null;
}

export interface Utility {
  id: string;
  name: string;
  type: UtilityType;
  /** De onde lançar (texto curto). */
  startPosition: string;
  /** Onde a granada cai / o que cobre. */
  targetPosition: string;
  throwType: ThrowType;
  instructions: string;
  /** Vídeo/GIF curto do lineup. `null` no protótipo. */
  videoUrl: string | null;
  /** Player responsável (1–5), se houver. */
  player: PlayerCount | null;
  /** Posição no mapa esquemático. */
  mapPoint: MapPoint | null;
}

export interface PlayerRole {
  player: PlayerCount;
  /** Onde o jogador fica / para onde vai. Ex.: "Rampa". */
  position: string;
  /** O que ele faz. Ex.: "Primeiro contato". */
  responsibility: string;
}

export type MapMarkerKind = 'PLAYER' | 'SMOKE' | 'FLASH' | 'MOLOTOV' | 'TARGET';

export interface MapMarker extends MapPoint {
  id: string;
  kind: MapMarkerKind;
  label?: string;
  /** Liga o marcador a uma utilitária (destaque ao selecionar). */
  utilityId?: string;
}

export interface MapPath {
  id: string;
  player: PlayerCount | null;
  points: MapPoint[];
}

export interface MapPlan {
  markers: MapMarker[];
  paths: MapPath[];
}

export interface CallSource {
  type: 'CURATED' | 'COMMUNITY' | 'USER';
  name: string;
}

export interface Call {
  id: string;
  mapId: string;
  side: Side;
  economy: Economy;
  category: CallCategory;
  playersRequired: PlayerCount;
  title: string;
  /** A frase curta e pronunciável. É a informação mais importante do produto. */
  shortCall: string;
  objective: string;
  /** Etapas objetivas, em ordem. */
  execution: string[];
  playerRoles: PlayerRole[];
  utilities: Utility[];
  /** "Se der errado". Frase curta. */
  fallback: string | null;
  difficulty: Difficulty;
  site: Site;
  /** Regiões do mapa envolvidas (ex.: "Rampa", "Meio"). */
  regions: string[];
  tags: string[];
  source: CallSource;
  /** ISO 8601. */
  updatedAt: string;
  mapPlan: MapPlan | null;
  /** Hidratado pelo backend quando houver usuário autenticado. Opcional. */
  favorite?: boolean;
}

/** Versão enxuta usada em listas (cards). */
export type CallSummary = Pick<
  Call,
  | 'id'
  | 'mapId'
  | 'side'
  | 'economy'
  | 'category'
  | 'playersRequired'
  | 'title'
  | 'shortCall'
  | 'difficulty'
  | 'site'
  | 'tags'
  | 'updatedAt'
> & { favorite?: boolean };

export type PlayersFilter = PlayerCount | 'ANY';

/** Filtros aceitos por getCallsByFilters. Campos ausentes = sem filtro. */
export interface CallFilters {
  mapId?: string;
  side?: Side;
  economy?: Economy;
  players?: PlayersFilter;
  categories?: CallCategory[];
  site?: Site;
  region?: string;
  difficulty?: Difficulty;
  tags?: string[];
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/** Opções dinâmicas de filtro para a Enciclopédia. */
export interface FilterOptions {
  regions: string[];
  tags: string[];
}
