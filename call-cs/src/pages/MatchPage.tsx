import { ChevronDown } from 'lucide-react';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CATEGORY_LABEL, ECONOMIES, MATCH_CATEGORIES } from '@/config/taxonomy';
import { useCallDetailParam } from '@/hooks/useCallDetailParam';
import { useCalls, useFavoriteCalls, useMaps } from '@/hooks/useData';
import { useFavorites } from '@/hooks/FavoritesProvider';
import { useHotkeys } from '@/hooks/useHotkeys';
import { useMatchPrefs } from '@/hooks/useMatchPrefs';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useRandomCall } from '@/hooks/useRandomCall';
import { cn } from '@/lib/cn';
import type { CallFilters, GameMap } from '@/types/domain';
import { CallDetail } from '@/components/calls/CallDetail';
import { CallList } from '@/components/calls/CallList';
import { RandomCallButton } from '@/components/calls/RandomCallButton';
import { CategoryFilter, EconomyFilter, PlayerFilter, SideToggle } from '@/components/filters/MatchFilters';
import { MapGrid, MapTabs } from '@/components/filters/MapSelector';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { Overlay } from '@/components/ui/Overlay';
import { EmptyState, ErrorState, GhostButton } from '@/components/states/States';

type Tab = 'calls' | 'favs';

/**
 * MODO PARTIDA — tela principal do produto.
 * Mapa fica fixo; o jogador só muda as condições do round e as calls aparecem na hora.
 * Mobile: lado no topo (muda 1x por partida), economia/jogadores/tipo no dock inferior (polegar).
 */
export function MatchPage() {
  const { mapId } = useParams<{ mapId: string }>();
  const navigate = useNavigate();
  const maps = useMaps();
  const { prefs, update } = useMatchPrefs();
  const favorites = useFavorites();
  const detail = useCallDetailParam();
  const [tab, setTab] = useState<Tab>('calls');
  const [mapSheet, setMapSheet] = useState(false);
  const isMobile = !useMediaQuery('(min-width: 768px)');

  const activeMaps = useMemo(() => maps.data?.filter((m) => m.active) ?? [], [maps.data]);
  const map = maps.data?.find((m) => m.id === mapId);

  // Lembra o mapa da partida.
  useEffect(() => {
    if (mapId && map) update('mapId', mapId);
  }, [mapId, map, update]);

  // Categoria que não existe no lado atual é limpa.
  useEffect(() => {
    if (prefs.category && !MATCH_CATEGORIES[prefs.side].includes(prefs.category)) update('category', null);
  }, [prefs.side, prefs.category, update]);

  const filters: CallFilters = {
    mapId,
    side: prefs.side,
    economy: prefs.economy,
    players: prefs.players,
    categories: prefs.category ? [prefs.category] : undefined,
  };

  const calls = useCalls(filters, !!mapId);
  const favs = useFavoriteCalls(mapId, favorites.version, !!mapId);
  const random = useRandomCall(filters, (id) => detail.open(id, { random: true }));

  const goMap = (m: GameMap) => {
    setMapSheet(false);
    navigate(`/partida/${m.id}`);
  };

  // Atalhos (segundo monitor)
  useHotkeys(
    {
      t: () => update('side', 'TR'),
      c: () => update('side', 'CT'),
      '1': () => update('economy', 'PISTOL'),
      '2': () => update('economy', 'ECO'),
      '3': () => update('economy', 'FORCE_BUY'),
      '4': () => update('economy', 'FULL_BUY'),
      r: () => void random.roll(),
      f: () => setTab((t) => (t === 'favs' ? 'calls' : 'favs')),
    },
    !detail.callId && !!map,
  );

  // ----- sem mapa / mapa inválido -----
  if (!mapId || (maps.data && !map)) {
    return (
      <div className="mx-auto flex max-w-5xl flex-col gap-5 px-4 pb-16 pt-4 sm:px-6 md:pt-8 lg:px-10">
        <header className="flex items-center justify-between md:hidden">
          <span className="text-lg font-semibold">Modo Partida</span>
          <MobileMenu />
        </header>
        <h1 className="text-3xl font-semibold tracking-tight">{mapId ? 'Mapa não encontrado' : 'Qual o mapa da partida?'}</h1>
        {maps.status === 'error' ? <ErrorState error={maps.error} onRetry={maps.reload} /> : <MapGrid maps={activeMaps} onSelect={goMap} />}
      </div>
    );
  }

  const callState = {
    status: calls.status,
    data: calls.data?.items,
    error: calls.error,
    isRefreshing: calls.isRefreshing,
    reload: calls.reload,
  };
  const favState = {
    ...favs,
    // Favoritas deste mapa respeitam o lado selecionado (o que importa agora).
    data: favs.data?.filter((c) => c.side === prefs.side),
  };
  const favCount = favState.data?.length ?? 0;
  const total = calls.data?.total;
  const categories = MATCH_CATEGORIES[prefs.side];

  const emptyCalls = (
    <EmptyState
      text={`Sem calls de ${prefs.side} · ${ECONOMIES.find((e) => e.value === prefs.economy)?.label}${prefs.category ? ` · ${CATEGORY_LABEL[prefs.category]}` : ''} em ${map?.name ?? ''}. Tente outro filtro.`}
      actions={
        <>
          {prefs.category && <GhostButton onClick={() => update('category', null)}>Todas as jogadas</GhostButton>}
          {prefs.players !== 'ANY' && <GhostButton onClick={() => update('players', 'ANY')}>Qualquer nº de players</GhostButton>}
          <Link
            to={`/enciclopedia`}
            className="inline-flex h-10 items-center rounded-full px-4 text-sm font-semibold text-muted hover:text-ink"
          >
            Ver Enciclopédia
          </Link>
        </>
      }
    />
  );
  const emptyFavs = (
    <EmptyState
      title={`Nenhuma favorita ${prefs.side} em ${map?.name ?? 'este mapa'}`}
      text="Toque na ★ de uma call para ela aparecer aqui. Suas favoritas viram seu playbook."
      actions={<GhostButton onClick={() => setTab('calls')}>Ver calls</GhostButton>}
    />
  );

  const results = (
    <section aria-label="Calls" className="flex min-w-0 flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <SegmentedControl<Tab>
          ariaLabel="Lista"
          layoutId="match-tab"
          size="sm"
          className="w-[230px]"
          value={tab}
          onChange={setTab}
          options={[
            { value: 'calls', label: `Calls${total !== undefined ? ` · ${total}` : ''}` },
            { value: 'favs', label: `Favoritas${favState.data ? ` · ${favCount}` : ''}` },
          ]}
        />
        <span className="hidden text-xs text-faint lg:inline">
          Atalhos: <kbd>T</kbd>/<kbd>C</kbd> lado · <kbd>1–4</kbd> economia · <kbd>R</kbd> sortear · <kbd>F</kbd> favoritas
        </span>
      </div>
      {tab === 'calls' ? (
        <CallList state={callState} onOpen={(id) => detail.open(id)} empty={emptyCalls} className="xl:grid-cols-2" />
      ) : (
        <CallList state={favState} onOpen={(id) => detail.open(id)} empty={emptyFavs} className="xl:grid-cols-2" />
      )}
    </section>
  );

  return (
    <>
      {/* ================= MOBILE ================= */}
      {isMobile ? (
        <div>
          <header className="sticky top-0 z-30 flex items-center gap-2 bg-bg/80 px-4 pb-3 pt-[max(12px,env(safe-area-inset-top))] backdrop-blur-xl">
            <MobileMenu />
            <button
              type="button"
              onClick={() => setMapSheet(true)}
              className="surface inline-flex h-11 min-w-0 items-center gap-1.5 rounded-full pl-4 pr-3 text-[15px] font-semibold"
              aria-label={`Mapa: ${map?.name ?? mapId}. Trocar mapa`}
            >
              <span className="truncate capitalize">{map?.name ?? mapId}</span>
              <ChevronDown className="size-4 shrink-0 text-muted" />
            </button>
            <SideToggle id="m-side" value={prefs.side} onChange={(s) => update('side', s)} className="ml-auto w-[112px] shrink-0" />
            <RandomCallButton compact rolling={random.rolling} onClick={() => void random.roll()} />
          </header>
          <div className="px-4 pb-[calc(env(safe-area-inset-bottom)+210px)] pt-1">{results}</div>

          <div className="fixed inset-x-0 bottom-0 z-40 rounded-t-[28px] border-t border-white/10 bg-frame/90 px-3 pt-3 pb-safe shadow-[0_-20px_60px_-20px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
            <div className="flex flex-col gap-2.5">
              <CategoryFilter
                className="scrollbar-none -mx-3 overflow-x-auto px-3"
                options={categories}
                value={prefs.category}
                onChange={(c) => update('category', c)}
              />
              <PlayerFilter id="m-players" value={prefs.players} onChange={(p) => update('players', p)} />
              <EconomyFilter id="m-eco" size="lg" value={prefs.economy} onChange={(e) => update('economy', e)} />
            </div>
          </div>
        </div>
      ) : (
        /* ================= TABLET / DESKTOP ================= */
        <div className="flex min-h-full flex-col gap-5 px-5 pb-8 pt-5 lg:px-7 lg:pt-6">
          <header className="flex items-center gap-4">
            <div className="min-w-0 flex-1">
              <MapTabs maps={activeMaps} selectedId={mapId} onSelect={goMap} />
            </div>
            <RandomCallButton rolling={random.rolling} onClick={() => void random.roll()} />
          </header>

          {/* Tablet: faixa de filtros acima da lista */}
          <div className="surface flex flex-col gap-3 rounded-[var(--radius-card)] p-3 lg:hidden">
            <div className="flex gap-3">
              <SideToggle id="t-side" value={prefs.side} onChange={(s) => update('side', s)} className="w-40 shrink-0" />
              <EconomyFilter id="t-eco" value={prefs.economy} onChange={(e) => update('economy', e)} className="flex-1" />
            </div>
            <div className="flex items-center gap-3">
              <PlayerFilter
                id="t-players"
                size="sm"
                value={prefs.players}
                onChange={(p) => update('players', p)}
                className="w-[300px] shrink-0"
              />
              <CategoryFilter
                size="sm"
                className="scrollbar-none min-w-0 overflow-x-auto"
                options={categories}
                value={prefs.category}
                onChange={(c) => update('category', c)}
              />
            </div>
          </div>

          <div className="grid min-h-0 flex-1 gap-5 lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)]">
            {/* Desktop: coluna de filtros */}
            <aside className="hidden flex-col gap-3 lg:flex lg:sticky lg:top-0 lg:self-start">
              <FilterCard title="Lado">
                <SideToggle id="d-side" size="lg" value={prefs.side} onChange={(s) => update('side', s)} />
              </FilterCard>
              <FilterCard title="Economia">
                <div className="grid grid-cols-2 gap-2">
                  {ECONOMIES.map((e, i) => {
                    const active = prefs.economy === e.value;
                    return (
                      <button
                        key={e.value}
                        type="button"
                        aria-pressed={active}
                        onClick={() => update('economy', e.value)}
                        className={cn(
                          'flex h-14 flex-col items-start justify-center rounded-2xl px-3.5 text-left transition-colors duration-150',
                          active ? 'bg-ink text-[#0b0d10]' : 'bg-black/25 text-muted ring-1 ring-inset ring-white/[0.06] hover:text-ink',
                        )}
                      >
                        <span className="text-[15px] font-semibold leading-none">{e.label}</span>
                        <span className={cn('mt-1 text-[10px] font-bold', active ? 'text-black/40' : 'text-faint')}>{i + 1}</span>
                      </button>
                    );
                  })}
                </div>
              </FilterCard>
              <FilterCard title="Jogadores">
                <PlayerFilter id="d-players" size="sm" value={prefs.players} onChange={(p) => update('players', p)} />
              </FilterCard>
              <FilterCard title="Tipo da jogada">
                <CategoryFilter
                  size="sm"
                  className="flex-wrap"
                  options={categories}
                  value={prefs.category}
                  onChange={(c) => update('category', c)}
                />
              </FilterCard>
            </aside>

            {results}
          </div>
        </div>
      )}

      {/* Troca de mapa (mobile) */}
      <Overlay open={mapSheet} onClose={() => setMapSheet(false)} label="Trocar mapa">
        <div className="scroll-thin flex flex-col gap-4 overflow-y-auto p-5 pb-safe">
          <h2 className="text-lg font-semibold">Trocar mapa</h2>
          <MapGrid maps={activeMaps} selectedId={mapId} onSelect={goMap} className="grid-cols-2" />
        </div>
      </Overlay>

      <CallDetail
        callId={detail.callId}
        onClose={detail.close}
        maps={maps.data}
        random={detail.random}
        rerolling={random.rolling}
        onReroll={() => void random.roll(detail.callId ?? undefined)}
      />
    </>
  );
}

function FilterCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="surface flex flex-col gap-3 rounded-[var(--radius-card)] p-4">
      <h2 className="label">{title}</h2>
      {children}
    </div>
  );
}
