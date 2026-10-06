import { AnimatePresence, motion } from 'framer-motion';
import { Bomb, CircleAlert, Flame, Sparkles, Wind } from 'lucide-react';
import type { ReactNode } from 'react';
import { THROW_LABEL, UTILITY_LABEL } from '@/config/taxonomy';
import { cn } from '@/lib/cn';
import type { PlayerRole, Utility } from '@/types/domain';

export function Section({
  title,
  children,
  className,
  aside,
}: {
  title: string;
  children: ReactNode;
  className?: string;
  aside?: ReactNode;
}) {
  return (
    <section className={cn('flex flex-col gap-3', className)}>
      <div className="flex items-center justify-between">
        <h3 className="label">{title}</h3>
        {aside}
      </div>
      {children}
    </section>
  );
}

/** "SE DER ERRADO" — curto e sempre visível perto da call. */
export function FallbackCard({ text }: { text: string }) {
  return (
    <div role="alert" className="flex items-start gap-3 rounded-2xl border border-alert-danger-border bg-alert-danger-background px-4 py-3">
      <CircleAlert className="mt-0.5 size-[18px] shrink-0 text-alert-danger-title" />
      <p className="text-[15px] leading-snug">
        <span className="mr-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-alert-danger-title">Se der errado</span>
        <span className="text-ink/90">{text}</span>
      </p>
    </div>
  );
}

/** Responsabilidade de cada player — linguagem simples, fácil de repassar no voice. */
export function PlayerRoleCard({ role }: { role: PlayerRole }) {
  return (
    <li className="flex items-center gap-3 rounded-2xl bg-white/[0.04] px-3 py-2.5 ring-1 ring-inset ring-white/[0.05]">
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-ink text-sm font-extrabold text-[#0b0d10]">
        {role.player}
      </span>
      <div className="min-w-0">
        <p className="text-[15px] font-semibold leading-tight">{role.position}</p>
        <p className="text-sm leading-snug text-muted">{role.responsibility}</p>
      </div>
    </li>
  );
}

export function ExecutionSteps({ steps }: { steps: string[] }) {
  return (
    <ol className="flex flex-col gap-2">
      {steps.map((s, i) => (
        <li key={i} className="flex gap-3 text-[15px] leading-snug">
          <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-white/[0.07] text-xs font-bold text-muted">
            {i + 1}
          </span>
          <span className="text-ink/90">{s}</span>
        </li>
      ))}
    </ol>
  );
}

const UTIL_ICON: Record<Utility['type'], ReactNode> = {
  SMOKE: <Wind className="size-4" />,
  FLASH: <Sparkles className="size-4" />,
  MOLOTOV: <Flame className="size-4" />,
  HE: <Bomb className="size-4" />,
  DECOY: <Bomb className="size-4" />,
};

const UTIL_TONE: Record<Utility['type'], string> = {
  SMOKE: 'text-smoke',
  FLASH: 'text-flash',
  MOLOTOV: 'text-molly',
  HE: 'text-danger',
  DECOY: 'text-muted',
};

/** Chip de utilitária. Selecionar destaca no mapa e mostra o lineup (mock). */
export function UtilityChip({ utility, active, onClick }: { utility: Utility; active: boolean; onClick: () => void }) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'inline-flex h-10 items-center gap-2 rounded-full px-3.5 text-sm font-semibold transition-colors',
        active ? 'bg-ink text-[#0b0d10]' : 'bg-white/[0.05] text-ink ring-1 ring-inset ring-white/[0.07] hover:bg-white/[0.09]',
      )}
    >
      <span className={active ? 'text-[#0b0d10]' : UTIL_TONE[utility.type]}>{UTIL_ICON[utility.type]}</span>
      {utility.name}
      {utility.player && <span className={cn('text-xs font-bold', active ? 'text-black/50' : 'text-faint')}>P{utility.player}</span>}
    </motion.button>
  );
}

export function UtilityDetail({ utility }: { utility: Utility | null }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      {utility && (
        <motion.div
          key={utility.id}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.18 }}
          className="overflow-hidden"
        >
          <div className="grid gap-3 rounded-2xl bg-white/[0.04] p-4 ring-1 ring-inset ring-white/[0.06] sm:grid-cols-[1fr_140px]">
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div>
                <dt className="label">Tipo</dt>
                <dd className="mt-0.5 font-medium">{UTILITY_LABEL[utility.type]}</dd>
              </div>
              <div>
                <dt className="label">Lançamento</dt>
                <dd className="mt-0.5 font-medium">{THROW_LABEL[utility.throwType]}</dd>
              </div>
              <div>
                <dt className="label">De onde</dt>
                <dd className="mt-0.5 font-medium">{utility.startPosition}</dd>
              </div>
              <div>
                <dt className="label">Onde cai</dt>
                <dd className="mt-0.5 font-medium">{utility.targetPosition}</dd>
              </div>
              <p className="col-span-2 text-muted">{utility.instructions}</p>
            </dl>
            <div className="grid aspect-video place-items-center rounded-xl bg-black/40 text-center text-xs text-faint ring-1 ring-inset ring-white/[0.05] sm:aspect-auto">
              {utility.videoUrl ? 'Vídeo' : 'Vídeo do lineup em breve'}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
