import { motion } from 'framer-motion';
import { ArrowRight, BookOpen } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useMaps } from '@/hooks/useData';
import { loadMatchPrefs } from '@/storage/preferences';
import { MapGrid } from '@/components/filters/MapSelector';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { Logo } from '@/components/ui/Logo';
import { ErrorState } from '@/components/states/States';

/** Entrada: direto ao produto. Escolher mapa → Modo Partida. */
export function HomePage() {
  const maps = useMaps();
  const navigate = useNavigate();
  const lastMapId = loadMatchPrefs().mapId;
  const lastMap = maps.data?.find((m) => m.id === lastMapId);
  const activeMaps = maps.data?.filter((m) => m.active) ?? [];

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 pb-16 pt-4 sm:px-6 md:pt-8 lg:px-10 lg:pt-12">
      <header className="flex items-center justify-between md:hidden">
        <Logo className="text-lg" />
        <MobileMenu />
      </header>

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-4"
      >
        <div className="hidden md:block">
          <Logo className="text-sm text-muted" />
        </div>
        <h1 className="text-balance text-[40px] font-semibold leading-[1.02] tracking-[-0.03em] sm:text-6xl">
          Sua próxima call
          <br />
          <span className="text-muted">em segundos.</span>
        </h1>
        <p className="max-w-md text-[15px] text-muted">
          Escolha o mapa. Entre round e outro, toque em lado, economia e tipo — leia a call e fale no voice.
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {lastMap && (
            <motion.button
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={() => navigate(`/partida/${lastMap.id}`)}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-ink px-5 text-[15px] font-semibold text-[#0b0d10]"
            >
              Continuar em {lastMap.name} <ArrowRight className="size-4" />
            </motion.button>
          )}
          <Link
            to="/enciclopedia"
            className="inline-flex h-12 items-center gap-2 rounded-full bg-white/[0.06] px-5 text-[15px] font-semibold text-ink ring-1 ring-inset ring-white/[0.08] hover:bg-white/[0.1]"
          >
            <BookOpen className="size-4" /> Entrar na Enciclopédia
          </Link>
        </div>
      </motion.section>

      <section className="flex flex-col gap-3">
        <h2 className="label">Selecionar mapa</h2>
        {maps.status === 'error' ? (
          <ErrorState error={maps.error} onRetry={maps.reload} />
        ) : maps.data ? (
          <MapGrid maps={activeMaps} selectedId={lastMapId} onSelect={(m) => navigate(`/partida/${m.id}`)} />
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="surface aspect-[4/3] animate-pulse rounded-[22px]" />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
