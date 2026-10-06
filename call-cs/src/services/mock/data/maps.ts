import type { GameMap } from '@/types/domain';

/**
 * MOCK — pool de mapas. Será substituído por GET /maps.
 * Layouts são esquemáticos (coordenadas 0–100), não radares oficiais.
 */
export const mockMaps: GameMap[] = [
  {
    id: 'mirage',
    name: 'Mirage',
    slug: 'mirage',
    image: null,
    active: true,
    order: 1,
    layout: {
      sites: { A: { x: 34, y: 80 }, B: { x: 18, y: 22 } },
      zones: [
        { id: 't-spawn', label: 'Base TR', x: 90, y: 50 },
        { id: 'ct-spawn', label: 'CT', x: 16, y: 60 },
        { id: 'ramp', label: 'Rampa', x: 66, y: 76 },
        { id: 'palace', label: 'Palácio', x: 60, y: 92 },
        { id: 'jungle', label: 'Jungle', x: 38, y: 62 },
        { id: 'stairs', label: 'Escada', x: 48, y: 70 },
        { id: 'mid', label: 'Meio', x: 66, y: 44 },
        { id: 'window', label: 'Janela', x: 34, y: 44 },
        { id: 'connector', label: 'Conector', x: 44, y: 54 },
        { id: 'short', label: 'Curto', x: 30, y: 33 },
        { id: 'apps', label: 'Apê', x: 52, y: 18 },
        { id: 'market', label: 'Mercado', x: 14, y: 40 },
      ],
    },
  },
  {
    id: 'inferno',
    name: 'Inferno',
    slug: 'inferno',
    image: null,
    active: true,
    order: 2,
    layout: {
      sites: { A: { x: 76, y: 30 }, B: { x: 34, y: 16 } },
      zones: [
        { id: 't-spawn', label: 'Base TR', x: 22, y: 90 },
        { id: 'ct-spawn', label: 'CT', x: 60, y: 14 },
        { id: 'banana', label: 'Banana', x: 34, y: 50 },
        { id: 'mid', label: 'Meio', x: 52, y: 62 },
        { id: 'apps', label: 'Apê', x: 72, y: 60 },
        { id: 'pit', label: 'Pit', x: 88, y: 26 },
        { id: 'library', label: 'Biblioteca', x: 82, y: 42 },
        { id: 'arch', label: 'Arco', x: 62, y: 34 },
      ],
    },
  },
  {
    id: 'dust2',
    name: 'Dust2',
    slug: 'dust2',
    image: null,
    active: true,
    order: 3,
    layout: {
      sites: { A: { x: 80, y: 18 }, B: { x: 18, y: 18 } },
      zones: [
        { id: 't-spawn', label: 'Base TR', x: 48, y: 90 },
        { id: 'ct-spawn', label: 'CT', x: 56, y: 22 },
        { id: 'long', label: 'Long', x: 86, y: 52 },
        { id: 'short', label: 'Short', x: 62, y: 34 },
        { id: 'mid', label: 'Meio', x: 48, y: 52 },
        { id: 'tunnels', label: 'Túnel', x: 22, y: 50 },
        { id: 'doors', label: 'Portas', x: 36, y: 32 },
      ],
    },
  },
  {
    id: 'nuke',
    name: 'Nuke',
    slug: 'nuke',
    image: null,
    active: true,
    order: 4,
    layout: {
      sites: { A: { x: 50, y: 40 }, B: { x: 54, y: 62 } },
      zones: [
        { id: 't-spawn', label: 'Base TR', x: 10, y: 50 },
        { id: 'ct-spawn', label: 'CT', x: 86, y: 50 },
        { id: 'outside', label: 'Fora', x: 50, y: 16 },
        { id: 'ramp', label: 'Rampa', x: 34, y: 66 },
        { id: 'lobby', label: 'Lobby', x: 26, y: 46 },
      ],
    },
  },
  {
    id: 'ancient',
    name: 'Ancient',
    slug: 'ancient',
    image: null,
    active: true,
    order: 5,
    layout: {
      sites: { A: { x: 24, y: 26 }, B: { x: 78, y: 32 } },
      zones: [
        { id: 't-spawn', label: 'Base TR', x: 50, y: 90 },
        { id: 'ct-spawn', label: 'CT', x: 52, y: 14 },
        { id: 'mid', label: 'Meio', x: 50, y: 50 },
        { id: 'main-a', label: 'Main A', x: 22, y: 60 },
        { id: 'ramp-b', label: 'Rampa B', x: 76, y: 62 },
      ],
    },
  },
  {
    id: 'anubis',
    name: 'Anubis',
    slug: 'anubis',
    image: null,
    active: true,
    order: 6,
    layout: {
      sites: { A: { x: 78, y: 24 }, B: { x: 22, y: 24 } },
      zones: [
        { id: 't-spawn', label: 'Base TR', x: 50, y: 92 },
        { id: 'ct-spawn', label: 'CT', x: 50, y: 12 },
        { id: 'mid', label: 'Meio / Água', x: 50, y: 50 },
        { id: 'main-a', label: 'Main A', x: 80, y: 62 },
        { id: 'main-b', label: 'Main B', x: 20, y: 62 },
      ],
    },
  },
  {
    id: 'cache',
    name: 'Cache',
    slug: 'cache',
    image: null,
    active: true,
    order: 7,
    layout: {
      sites: { A: { x: 22, y: 26 }, B: { x: 26, y: 78 } },
      zones: [
        { id: 't-spawn', label: 'Base TR', x: 90, y: 50 },
        { id: 'ct-spawn', label: 'CT', x: 10, y: 50 },
        { id: 'mid', label: 'Meio', x: 52, y: 50 },
        { id: 'main-a', label: 'Main A', x: 56, y: 22 },
        { id: 'main-b', label: 'Main B', x: 60, y: 80 },
      ],
    },
  },
];
