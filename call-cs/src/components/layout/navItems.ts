import { BookOpen, Crosshair, House, Star, type LucideIcon } from 'lucide-react';
import { loadMatchPrefs } from '@/storage/preferences';

export interface NavItem {
  id: 'home' | 'match' | 'library' | 'favorites';
  label: string;
  icon: LucideIcon;
  to: () => string;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Início', icon: House, to: () => '/' },
  {
    id: 'match',
    label: 'Modo Partida',
    icon: Crosshair,
    to: () => {
      const id = loadMatchPrefs().mapId;
      return id ? `/partida/${id}` : '/partida';
    },
  },
  { id: 'library', label: 'Enciclopédia', icon: BookOpen, to: () => '/enciclopedia' },
  { id: 'favorites', label: 'Favoritas', icon: Star, to: () => '/enciclopedia?fav=1' },
];

export function activeNavId(pathname: string, search: string): NavItem['id'] {
  if (pathname.startsWith('/partida')) return 'match';
  if (pathname.startsWith('/enciclopedia')) return new URLSearchParams(search).get('fav') === '1' ? 'favorites' : 'library';
  return 'home';
}
