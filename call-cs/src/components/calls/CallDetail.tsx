import { motion } from 'framer-motion';
import { Dices, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { CATEGORY_LABEL } from '@/config/taxonomy';
import { useCall } from '@/hooks/useData';
import type { GameMap } from '@/types/domain';
import { Overlay } from '@/components/ui/Overlay';
import { IconButton } from '@/components/ui/IconButton';
import { Badge } from '@/components/core/badge';
import { Button } from '@/components/core/button';
import { ErrorState } from '@/components/states/States';
import { CopyCallButton } from './CopyCallButton';
import { FavoriteButton } from './FavoriteButton';
import { MetaTags, SideBadge } from './MetaTags';
import { ExecutionSteps, FallbackCard, PlayerRoleCard, Section, UtilityChip, UtilityDetail } from './CallDetailParts';
import { MapLegend, TacticalMap } from './TacticalMap';

interface Props {
  callId: string | null;
  onClose: () => void;
  maps: GameMap[] | undefined;
  /** Quando aberta via "Me dá uma call". */
  random?: boolean;
  onReroll?: () => void;
  rerolling?: boolean;
}

/**
 * Detalhe da call.
 * Desktop: esquerda = call / objetivo / players / execução; direita = mapa + utilitárias.
 * Mobile: tudo em uma coluna, call primeiro.
 */
export function CallDetail({ callId, onClose, maps, random, onReroll, rerolling }: Props) {
  // Mantém a última call na tela durante a animação de saída.
  const last = useRef(callId);
  if (callId) last.current = callId;
  const shownId = callId ?? last.current;
  return (
    <Overlay open={!!callId} onClose={onClose} label="Detalhe da call" size="detail">
      {shownId && (
        <DetailBody
          key={shownId}
          callId={shownId}
          onClose={onClose}
          maps={maps}
          random={random}
          onReroll={onReroll}
          rerolling={rerolling}
        />
      )}
    </Overlay>
  );
}

function DetailBody({ callId, onClose, maps, random, onReroll, rerolling }: Props & { callId: string }) {
  const state = useCall(callId);
  const [activeUtil, setActiveUtil] = useState<string | null>(null);
  const call = state.data;
  const map = maps?.find((m) => m.id === call?.mapId);

  const header = (
    <div className="flex shrink-0 items-center justify-between gap-2 border-b border-line px-4 py-3 md:px-6 md:py-4">
      <div className="flex min-w-0 items-center gap-2.5">
        {call && (
          <>
            <SideBadge side={call.side} />
            <span className="truncate text-[11px] font-bold uppercase tracking-[0.14em] text-faint">
              {CATEGORY_LABEL[call.category]} · {map?.name ?? call.mapId}
            </span>
          </>
        )}
        {random && (
          <Badge color="primary" size="sm" className="font-bold uppercase tracking-[0.12em]">
            <Dices /> Sorteada
          </Badge>
        )}
      </div>
      <div className="flex items-center gap-1">
        {random && onReroll && (
          <Button variant="ghost" size="sm" onPress={onReroll} pending={rerolling}>
            <motion.span
              animate={rerolling ? { rotate: 360 } : { rotate: 0 }}
              transition={rerolling ? { repeat: Infinity, duration: 0.5, ease: 'linear' } : { duration: 0 }}
              className="inline-flex"
            >
              <Dices className="size-4" />
            </motion.span>
            Outra
          </Button>
        )}
        {call && <FavoriteButton callId={call.id} size="sm" />}
        <IconButton label="Fechar" variant="ghost" size="sm" onPress={onClose}>
          <X className="size-5" />
        </IconButton>
      </div>
    </div>
  );

  if (state.status === 'error') {
    return (
      <>
        {header}
        <div className="p-6">
          <ErrorState error={state.error} onRetry={state.reload} />
        </div>
      </>
    );
  }

  if (!call) {
    return (
      <>
        {header}
        <div className="grid gap-4 p-6" aria-busy="true">
          <div className="h-4 w-32 animate-pulse rounded-full bg-white/[0.07]" />
          <div className="h-8 w-full animate-pulse rounded-full bg-white/[0.08]" />
          <div className="h-8 w-2/3 animate-pulse rounded-full bg-white/[0.08]" />
          <div className="mt-4 h-40 animate-pulse rounded-3xl bg-white/[0.04]" />
        </div>
      </>
    );
  }

  const selectedUtility = call.utilities.find((u) => u.id === activeUtil) ?? null;

  return (
    <>
      {header}
      <div className="scroll-thin min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <div className="grid gap-6 p-4 pb-10 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:gap-8 md:p-6 lg:p-8">
          {/* ESQUERDA — o que se fala no voice */}
          <div className="flex min-w-0 flex-col gap-7">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-4"
            >
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-lg font-semibold text-muted">{call.title}</h2>
                <CopyCallButton text={call.shortCall} withLabel />
              </div>
              <div className="relative rounded-[26px] bg-white/[0.06] p-5 ring-1 ring-inset ring-white/[0.08] md:p-6">
                <span className="label text-accent">Call</span>
                <p className="mt-2 text-pretty text-[26px] font-semibold leading-[1.18] tracking-[-0.015em] md:text-[32px]">
                  {call.shortCall}
                </p>
              </div>
              {call.fallback && <FallbackCard text={call.fallback} />}
              <MetaTags call={call} />
            </motion.div>

            <Section title="Objetivo">
              <p className="text-[15px] leading-relaxed text-ink/90">{call.objective}</p>
            </Section>

            <Section title={`Jogadores · ${call.playerRoles.length}`}>
              <ul className="grid gap-2 sm:grid-cols-2 md:grid-cols-1 xl:grid-cols-2">
                {call.playerRoles.map((r) => (
                  <PlayerRoleCard key={r.player} role={r} />
                ))}
              </ul>
            </Section>

            <Section title="Execução">
              <ExecutionSteps steps={call.execution} />
            </Section>
          </div>

          {/* DIREITA — suporte visual */}
          <div className="flex min-w-0 flex-col gap-7 md:sticky md:top-0 md:self-start">
            <Section title="Utilitárias">
              {call.utilities.length === 0 ? (
                <p className="text-sm text-muted">Sem utilitária. Jogada no tiro.</p>
              ) : (
                <>
                  <div className="flex flex-wrap gap-2">
                    {call.utilities.map((u) => (
                      <UtilityChip
                        key={u.id}
                        utility={u}
                        active={u.id === activeUtil}
                        onClick={() => setActiveUtil(activeUtil === u.id ? null : u.id)}
                      />
                    ))}
                  </div>
                  <UtilityDetail utility={selectedUtility} />
                </>
              )}
            </Section>
            <Section title="Mapa">
              <TacticalMap call={call} map={map} activeUtilityId={activeUtil} className="mx-auto w-full max-w-[460px]" />
              <MapLegend />
            </Section>
          </div>
        </div>
      </div>
    </>
  );
}
