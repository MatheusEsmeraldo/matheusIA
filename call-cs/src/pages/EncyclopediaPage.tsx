import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ALL_CATEGORIES, CATEGORY_LABEL, DIFFICULTIES, ECONOMIES, PLAYER_OPTIONS, SITES } from '@/config/taxonomy';
import { useCallDetailParam } from '@/hooks/useCallDetailParam';
import { useCalls, useFavoriteCalls, useFilterOptions, useMaps } from '@/hooks/useData';
import { useFavorites } from '@/hooks/FavoritesProvider';
import { cn } from '@/lib/cn';
import { loadMatchPrefs } from '@/storage/preferences';
import type { CallCategory, CallFilters, Difficulty, Economy, GameMap, PlayersFilter, Side, Site } from '@/types/domain';
import { CallDetail } from '@/components/calls/CallDetail';
import { CallList } from '@/components/calls/CallList';
import { Chip } from '@/components/filters/Chip';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { Overlay } from '@/components/ui/Overlay';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { EmptyState, GhostButton } from '@/components/states/States';

type All = 'ALL';
interface LibFilters {
  mapId: string | All;
  side: Side | All;
  economy: Economy | All;
  players: PlayersFilter;
  categories: CallCategory[];
  site: Site | All;
  difficulty: Difficulty | All;
  region: string | All;
  tags: string[];
}

const EMPTY: LibFilters = {
  mapId: 'ALL',
  side: 'ALL',
  economy: 'ALL',
  players: 'ANY',
  categories: [],
  site: 'ALL',
  difficulty: 'ALL',
  region: 'ALL',
  tags: [],
};

function toCallFilters(f: LibFilters, search: string): CallFilters {
  const v = <T,>(x: T | All) => (x === 'ALL' ? undefined : x);
  return {
    mapId: v(f.mapId),
    side: v(f.side),
    economy: v(f.economy),
    players: f.players,
    categories: f.categories.length ? f.categories : undefined,
    site: v(f.site),
    difficulty: v(f.difficulty),
    region: v(f.region),
    tags: f.tags.length ? f.tags : undefined,
    search: search.trim() || undefined,
  };
}

function countActive(f: LibFilters): number {
  return (
    Number(f.side !== 'ALL') +
    Number(f.economy !== 'ALL') +
    Number(f.players !== 'ANY') +
    f.categories.length +
    Number(f.site !== 'ALL') +
    Number(f.difficulty !== 'ALL') +
    Number(f.region !== 'ALL') +
    f.tags.length
  );
}

/**
 * ENCICLOPÉDIA — explorar e estudar com calma. Mais filtros, mesma limpeza visual.
 * `?fav=1` abre direto nas favoritas.
 */
export function EncyclopediaPage() {
  const maps = useMaps();
  const [params, setParams] = useSearchParams();
  const onlyFav = params.get('fav') === '1';
  const detail = useCallDetailParam();
  const favorites = useFavorites();
  const [filters, setFilters] = useState<LibFilters>(() => ({ ...EMPTY, mapId: loadMatchPrefs().mapId ?? 'ALL' }));
  const [search, setSearch] = useState('');
  const [sheet, setSheet] = useState(false);

  const callFilters = useMemo(() => toCallFilters(filters, search), [filters, search]);
  const calls = useCalls(callFilters, !onlyFav);
  const mapForFav = filters.mapId === 'ALL' ? undefined : filters.mapId;
  const favs = useFavoriteCalls(mapForFav, favorites.version, onlyFav);
  const options = useFilterOptions(mapForFav);

  const set = <K extends keyof LibFilters>(k: K, v: LibFilters[K]) =>
    setFilters((f) => ({ ...f, [k]: v, ...(k === 'mapId' ? { region: 'ALL' as const, tags: [] } : {}) }));
  const toggleIn = <K extends 'categories' | 'tags'>(k: K, v: LibFilters[K][number]) =>
    setFilters((f) => {
      const list = f[k] as string[];
      return { ...f, [k]: list.includes(v) ? list.filter((x) => x !== v) : [...list, v] };
    });
  const clear = () => setFilters((f) => ({ ...EMPTY, mapId: f.mapId }));
  const setTab = (fav: boolean) =>
    setParams((p) => {
      const next = new URLSearchParams(p);
      if (fav) next.set('fav', '1');
      else next.delete('fav');
      return next;
    });

  const active = countActive(filters);
  const activeMaps = maps.data?.filter((m) => m.active) ?? [];

  const listState = onlyFav
    ? favs
    : { status: calls.status, data: calls.data?.items, error: calls.error, isRefreshing: calls.isRefreshing, reload: calls.reload };

  const panel = (
    <FilterPanel
      filters={filters}
      maps={activeMaps}
      regions={options.data?.regions ?? []}
      tags={options.data?.tags ?? []}
      set={set}
      toggleIn={toggleIn}
      onlyFav={onlyFav}
      idPrefix={sheet ? 's' : 'd'}
    />
  );

  const total = onlyFav ? favs.data?.length : calls.data?.total;

  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-4 px-4 pb-16 pt-[max(12px,env(safe-area-inset-top))] sm:px-6 md:pt-6 lg:px-7">
      <header className="flex items-center gap-3">
        <MobileMenu className="md:hidden" />
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{onlyFav ? 'Favoritas' : 'Enciclopédia'}</h1>
        <span className="text-sm text-faint">{total !== undefined ? `${total} calls` : ''}</span>
      </header>

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <label className="surface flex h-12 flex-1 items-center gap-2 rounded-full px-4 focus-within:ring-2 focus-within:ring-accent/60">
          <Search className="size-4 text-faint" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar call, região, tag…"
            disabled={onlyFav}
            className="h-full min-w-0 flex-1 bg-transparent text-[15px] text-ink placeholder:text-faint focus:outline-none disabled:opacity-40"
            aria-label="Buscar"
          />
          {search && (
            <button type="button" onClick={() => setSearch('')} aria-label="Limpar busca" className="text-faint hover:text-ink">
              <X className="size-4" />
            </button>
          )}
        </label>
        <div className="flex items-center gap-2">
          <SegmentedControl<'all' | 'fav'>
            ariaLabel="Mostrar"
            layoutId="lib-tab"
            className="flex-1 md:w-[240px] md:flex-none"
            value={onlyFav ? 'fav' : 'all'}
            onChange={(v) => setTab(v === 'fav')}
            options={[
              { value: 'all', label: 'Todas' },
              { value: 'fav', label: 'Favoritas' },
            ]}
          />
          <button
            type="button"
            onClick={() => setSheet(true)}
            className="surface inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold lg:hidden"
          >
            <SlidersHorizontal className="size-4" />
            Filtros
            {active > 0 && (
              <span className="grid size-5 place-items-center rounded-full bg-accent text-[11px] font-bold text-[#0b0d10]">{active}</span>
            )}
          </button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="surface hidden self-start rounded-[var(--radius-card)] p-4 lg:sticky lg:top-0 lg:block">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="label">Filtros</h2>
            {active > 0 && (
              <button type="button" onClick={clear} className="text-xs font-semibold text-accent">
                Limpar ({active})
              </button>
            )}
          </div>
          {!sheet && panel}
        </aside>

        <CallList
          state={listState}
          onOpen={(id) => detail.open(id)}
          maps={maps.data}
          showMapName
          density="compact"
          className="sm:grid-cols-2 2xl:grid-cols-3"
          empty={
            onlyFav ? (
              <EmptyState
                title="Nenhuma favorita ainda"
                text="Toque na ★ de qualquer call para salvar. Elas aparecem também no Modo Partida."
                actions={<GhostButton onClick={() => setTab(false)}>Ver todas</GhostButton>}
              />
            ) : (
              <EmptyState
                text="Nada com esses filtros. Remova alguns para ver mais calls."
                actions={
                  <>
                    {active > 0 && <GhostButton onClick={clear}>Limpar filtros</GhostButton>}
                    {filters.mapId !== 'ALL' && <GhostButton onClick={() => set('mapId', 'ALL')}>Todos os mapas</GhostButton>}
                  </>
                }
              />
            )
          }
        />
      </div>

      <Overlay open={sheet} onClose={() => setSheet(false)} label="Filtros">
        <div className="flex items-center justify-between border-b border-line px-5 py-3">
          <h2 className="text-lg font-semibold">Filtros</h2>
          {active > 0 && (
            <button type="button" onClick={clear} className="text-sm font-semibold text-accent">
              Limpar
            </button>
          )}
        </div>
        <div className="scroll-thin min-h-0 flex-1 overflow-y-auto p-5">{sheet && panel}</div>
        <div className="border-t border-line p-4 pb-safe">
          <button
            type="button"
            onClick={() => setSheet(false)}
            className="h-12 w-full rounded-full bg-ink text-[15px] font-semibold text-[#0b0d10]"
          >
            Ver {total ?? ''} calls
          </button>
        </div>
      </Overlay>

      <CallDetail callId={detail.callId} onClose={detail.close} maps={maps.data} />
    </div>
  );
}

// ------------------------------------------------------------------

interface PanelProps {
  filters: LibFilters;
  maps: GameMap[];
  regions: string[];
  tags: string[];
  set: <K extends keyof LibFilters>(k: K, v: LibFilters[K]) => void;
  toggleIn: <K extends 'categories' | 'tags'>(k: K, v: LibFilters[K][number]) => void;
  onlyFav: boolean;
  idPrefix: string;
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="flex flex-col gap-2.5 border-t border-line py-4 first:border-t-0 first:pt-0">
      <legend className="label mb-2.5 float-left w-full">{title}</legend>
      {children}
    </fieldset>
  );
}

function FilterPanel({ filters: f, maps, regions, tags, set, toggleIn, onlyFav, idPrefix }: PanelProps) {
  return (
    <div className="flex flex-col">
      <Group title="Mapa">
        <div className="flex flex-wrap gap-1.5">
          <Chip size="sm" active={f.mapId === 'ALL'} onClick={() => set('mapId', 'ALL')}>
            Todos
          </Chip>
          {maps.map((m) => (
            <Chip key={m.id} size="sm" active={f.mapId === m.id} onClick={() => set('mapId', m.id)}>
              {m.name}
            </Chip>
          ))}
        </div>
      </Group>

      {onlyFav ? (
        <p className="pt-2 text-sm text-muted">Nas favoritas, só o filtro de mapa vale.</p>
      ) : (
        <div className={cn('flex flex-col')}>
          <Group title="Lado">
            <SegmentedControl
              ariaLabel="Lado"
              layoutId={`${idPrefix}-lib-side`}
              size="sm"
              value={f.side}
              onChange={(v) => set('side', v)}
              options={[
                { value: 'ALL', label: 'Ambos' },
                { value: 'TR', label: 'TR' },
                { value: 'CT', label: 'CT' },
              ]}
            />
          </Group>
          <Group title="Economia">
            <div className="flex flex-wrap gap-1.5">
              <Chip size="sm" active={f.economy === 'ALL'} onClick={() => set('economy', 'ALL')}>
                Todas
              </Chip>
              {ECONOMIES.map((e) => (
                <Chip key={e.value} size="sm" active={f.economy === e.value} onClick={() => set('economy', e.value)}>
                  {e.label}
                </Chip>
              ))}
            </div>
          </Group>
          <Group title="Jogadores">
            <div className="flex flex-wrap gap-1.5">
              {PLAYER_OPTIONS.map((p) => (
                <Chip key={String(p.value)} size="sm" active={f.players === p.value} onClick={() => set('players', p.value)}>
                  {p.value === 'ANY' ? 'Qualquer' : p.label}
                </Chip>
              ))}
            </div>
          </Group>
          <Group title="Categoria">
            <div className="flex flex-wrap gap-1.5">
              {ALL_CATEGORIES.map((c) => (
                <Chip key={c} size="sm" active={f.categories.includes(c)} onClick={() => toggleIn('categories', c)}>
                  {CATEGORY_LABEL[c]}
                </Chip>
              ))}
            </div>
          </Group>
          <Group title="Bombsite">
            <div className="flex flex-wrap gap-1.5">
              <Chip size="sm" active={f.site === 'ALL'} onClick={() => set('site', 'ALL')}>
                Todos
              </Chip>
              {SITES.map((s) => (
                <Chip key={s.value} size="sm" active={f.site === s.value} onClick={() => set('site', s.value)}>
                  {s.label}
                </Chip>
              ))}
            </div>
          </Group>
          {regions.length > 0 && (
            <Group title="Região">
              <div className="flex flex-wrap gap-1.5">
                <Chip size="sm" active={f.region === 'ALL'} onClick={() => set('region', 'ALL')}>
                  Todas
                </Chip>
                {regions.map((r) => (
                  <Chip key={r} size="sm" active={f.region === r} onClick={() => set('region', f.region === r ? 'ALL' : r)}>
                    {r}
                  </Chip>
                ))}
              </div>
            </Group>
          )}
          <Group title="Dificuldade">
            <div className="flex flex-wrap gap-1.5">
              <Chip size="sm" active={f.difficulty === 'ALL'} onClick={() => set('difficulty', 'ALL')}>
                Todas
              </Chip>
              {DIFFICULTIES.map((d) => (
                <Chip key={d.value} size="sm" active={f.difficulty === d.value} onClick={() => set('difficulty', d.value)}>
                  {d.label}
                </Chip>
              ))}
            </div>
          </Group>
          {tags.length > 0 && (
            <Group title="Tags">
              <div className="flex flex-wrap gap-1.5">
                {tags.map((t) => (
                  <Chip key={t} size="sm" active={f.tags.includes(t)} onClick={() => toggleIn('tags', t)}>
                    #{t}
                  </Chip>
                ))}
              </div>
            </Group>
          )}
        </div>
      )}
    </div>
  );
}
