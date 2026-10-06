import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';
import type { Call, GameMap, MapPoint, Utility } from '@/types/domain';

/**
 * Mapa tático ESQUEMÁTICO (placeholder). Não é o radar oficial.
 * Quando o backend fornecer `GameMap.image` (radar), ele entra como fundo
 * e as mesmas coordenadas 0–100 continuam valendo para marcadores e caminhos.
 */

const UTIL_COLOR: Record<Utility['type'], string> = {
  SMOKE: 'var(--color-smoke)',
  FLASH: 'var(--color-flash)',
  MOLOTOV: 'var(--color-molly)',
  HE: '#e57373',
  DECOY: '#9aa3ae',
};

function Grid() {
  return (
    <>
      <defs>
        <pattern id="tm-grid" width="5" height="5" patternUnits="userSpaceOnUse">
          <circle cx="0.5" cy="0.5" r="0.18" fill="rgb(255 255 255 / 0.12)" />
        </pattern>
        <marker id="tm-arrow" viewBox="0 0 6 6" refX="3" refY="3" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
          <path d="M0 0 L6 3 L0 6 z" fill="rgb(242 244 247 / 0.85)" />
        </marker>
      </defs>
      <rect width="100" height="100" fill="url(#tm-grid)" />
    </>
  );
}

function Sites({ map, target }: { map: GameMap; target?: string }) {
  if (!map.layout) return null;
  return (
    <>
      {(Object.entries(map.layout.sites) as [string, MapPoint][]).map(([key, p]) => {
        const hot = target === key;
        return (
          <g key={key}>
            <rect
              x={p.x - 9}
              y={p.y - 9}
              width="18"
              height="18"
              rx="4"
              fill={hot ? 'rgb(58 167 245 / 0.16)' : 'rgb(255 255 255 / 0.05)'}
              stroke={hot ? 'var(--color-accent)' : 'rgb(255 255 255 / 0.14)'}
              strokeWidth={hot ? 0.6 : 0.35}
              strokeDasharray={hot ? undefined : '1.2 1'}
            />
            <text
              x={p.x}
              y={p.y + 2.6}
              textAnchor="middle"
              fontSize="7.5"
              fontWeight="700"
              fill={hot ? 'var(--color-accent)' : 'rgb(255 255 255 / 0.22)'}
            >
              {key}
            </text>
          </g>
        );
      })}
    </>
  );
}

function Zones({ map }: { map: GameMap }) {
  if (!map.layout) return null;
  return (
    <>
      {map.layout.zones.map((z) => (
        <g key={z.id}>
          <circle cx={z.x} cy={z.y} r="0.7" fill="rgb(255 255 255 / 0.3)" />
          <text x={z.x} y={z.y - 1.8} textAnchor="middle" fontSize="2.6" fontWeight="500" fill="rgb(255 255 255 / 0.42)">
            {z.label}
          </text>
        </g>
      ))}
    </>
  );
}

/** Miniatura usada nos cards de mapa. */
export function MapThumb({ map, className }: { map: GameMap; className?: string }) {
  return (
    <svg viewBox="-4 -4 108 108" className={cn('pointer-events-none', className)} aria-hidden>
      <Sites map={map} />
      {map.layout?.zones.map((z) => (
        <circle key={z.id} cx={z.x} cy={z.y} r="1.1" fill="rgb(255 255 255 / 0.28)" />
      ))}
    </svg>
  );
}

function UtilityGlyph({ u, active }: { u: Utility; active: boolean }) {
  if (!u.mapPoint) return null;
  const { x, y } = u.mapPoint;
  const color = UTIL_COLOR[u.type];
  return (
    <g>
      {active && (
        <motion.circle
          cx={x}
          cy={y}
          r={6}
          fill="none"
          stroke={color}
          strokeWidth="0.5"
          initial={{ r: 4, opacity: 0.9 }}
          animate={{ r: 9, opacity: 0 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: 'easeOut' }}
        />
      )}
      {u.type === 'SMOKE' && (
        <circle cx={x} cy={y} r="4.2" fill="rgb(200 208 218 / 0.28)" stroke={color} strokeWidth={active ? 0.7 : 0.35} />
      )}
      {u.type === 'MOLOTOV' && (
        <circle cx={x} cy={y} r="3.4" fill="rgb(240 135 79 / 0.3)" stroke={color} strokeWidth={active ? 0.7 : 0.35} />
      )}
      {u.type === 'FLASH' && (
        <path
          d={`M${x} ${y - 3} L${x + 0.9} ${y - 0.9} L${x + 3} ${y} L${x + 0.9} ${y + 0.9} L${x} ${y + 3} L${x - 0.9} ${y + 0.9} L${x - 3} ${y} L${x - 0.9} ${y - 0.9} Z`}
          fill={color}
          opacity={active ? 1 : 0.85}
        />
      )}
      {(u.type === 'HE' || u.type === 'DECOY') && <circle cx={x} cy={y} r="2" fill={color} />}
    </g>
  );
}

export function TacticalMap({
  call,
  map,
  activeUtilityId,
  className,
}: {
  call: Call;
  map: GameMap | undefined;
  activeUtilityId?: string | null;
  className?: string;
}) {
  const plan = call.mapPlan;
  const target = plan?.markers.find((m) => m.kind === 'TARGET')?.label ?? (call.site === 'A' || call.site === 'B' ? call.site : undefined);
  const hasLayout = !!map?.layout;

  return (
    <div className={cn('relative overflow-hidden rounded-[22px] bg-black/30 ring-1 ring-inset ring-white/[0.06]', className)}>
      <svg
        viewBox="0 0 100 100"
        className="block aspect-square w-full"
        role="img"
        aria-label={`Mapa esquemático de ${map?.name ?? 'mapa'}`}
      >
        <Grid />
        {map && hasLayout && (
          <>
            <Sites map={map} target={target} />
            <Zones map={map} />
          </>
        )}
        {plan?.paths.map((p, i) => (
          <motion.polyline
            key={p.id + i}
            points={p.points.map((pt) => `${pt.x},${pt.y}`).join(' ')}
            fill="none"
            stroke="rgb(242 244 247 / 0.7)"
            strokeWidth="0.55"
            strokeDasharray="1.6 1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            markerEnd="url(#tm-arrow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 + i * 0.08, ease: 'easeOut' }}
          />
        ))}
        {call.utilities.map((u) => (
          <UtilityGlyph key={u.id} u={u} active={u.id === activeUtilityId} />
        ))}
        {plan?.markers
          .filter((m) => m.kind === 'PLAYER')
          .map((m, i) => (
            <motion.g key={m.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 + i * 0.03 }}>
              <circle cx={m.x} cy={m.y} r="2.6" fill="var(--color-ink)" />
              <text x={m.x} y={m.y + 1.05} textAnchor="middle" fontSize="2.9" fontWeight="800" fill="#0b0d10">
                {m.label}
              </text>
            </motion.g>
          ))}
      </svg>
      {!hasLayout && <div className="absolute inset-0 grid place-items-center text-sm text-faint">Mapa visual em breve</div>}
      <div className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-faint backdrop-blur">
        Esquemático
      </div>
    </div>
  );
}

export function MapLegend() {
  const items = [
    {
      label: 'Player',
      el: <span className="grid size-3.5 place-items-center rounded-full bg-ink text-[8px] font-black text-black">1</span>,
    },
    { label: 'Smoke', el: <span className="size-3.5 rounded-full border border-smoke bg-smoke/30" /> },
    { label: 'Flash', el: <span className="size-3 rotate-45 bg-flash" /> },
    { label: 'Molotov', el: <span className="size-3.5 rounded-full border border-molly bg-molly/30" /> },
    { label: 'Caminho', el: <span className="h-px w-4 border-t border-dashed border-ink/70" /> },
  ];
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted">
      {items.map((i) => (
        <span key={i.label} className="inline-flex items-center gap-1.5">
          {i.el}
          {i.label}
        </span>
      ))}
    </div>
  );
}
