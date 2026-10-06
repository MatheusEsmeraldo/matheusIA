import { motion } from 'framer-motion';
import { useId } from 'react';
import { cn } from '@/lib/cn';
import type { Call, GameMap, MapPoint, Utility } from '@/types/domain';

/**
 * Mapa tático com RADAR VETORIAL na identidade Call CS (GameMap.radar).
 * Coordenadas 0–100 compartilhadas por radar, bombsites, regiões, marcadores e caminhos.
 * Sem radar cadastrado, cai para o layout esquemático (só bombs e regiões).
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

/** Áreas jogáveis do mapa. Camadas extras (ex.: andar inferior) ficam por baixo, tracejadas. */
function Radar({ map, uid }: { map: GameMap; uid: string }) {
  if (!map.radar || map.radar.layers.length === 0) return null;
  const [main, ...others] = map.radar.layers;
  return (
    <g>
      <defs>
        <linearGradient id={`${uid}-floor`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="rgb(255 255 255 / 0.11)" />
          <stop offset="1" stopColor="rgb(255 255 255 / 0.05)" />
        </linearGradient>
      </defs>
      {others.map((l) => (
        <path
          key={l.id}
          d={l.path}
          fillRule="evenodd"
          fill="rgb(58 167 245 / 0.05)"
          stroke="rgb(58 167 245 / 0.45)"
          strokeWidth="0.22"
          strokeDasharray="0.9 0.7"
        />
      ))}
      <path
        d={main.path}
        fillRule="evenodd"
        fill={`url(#${uid}-floor)`}
        stroke="rgb(255 255 255 / 0.26)"
        strokeWidth="0.22"
        strokeLinejoin="round"
      />
    </g>
  );
}

function Sites({ map, target }: { map: GameMap; target?: string }) {
  if (!map.layout) return null;
  const r = map.radar ? 6 : 9;
  return (
    <>
      {(Object.entries(map.layout.sites) as [string, MapPoint][]).map(([key, p]) => {
        const hot = target === key;
        return (
          <g key={key}>
            <rect
              x={p.x - r}
              y={p.y - r}
              width={r * 2}
              height={r * 2}
              rx="3"
              fill={hot ? 'rgb(58 167 245 / 0.16)' : 'rgb(255 255 255 / 0.05)'}
              stroke={hot ? 'var(--color-accent)' : 'rgb(255 255 255 / 0.14)'}
              strokeWidth={hot ? 0.6 : 0.35}
              strokeDasharray={hot ? undefined : '1.2 1'}
            />
            <text
              x={p.x}
              y={p.y + r * 0.3}
              textAnchor="middle"
              fontSize={r * 0.85}
              fontWeight="700"
              fill={hot ? 'var(--color-accent)' : 'rgb(255 255 255 / 0.35)'}
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
          <text
            x={z.x}
            y={z.y - 1.8}
            textAnchor="middle"
            fontSize="2.6"
            fontWeight="600"
            fill="rgb(255 255 255 / 0.6)"
            stroke="#121519"
            strokeWidth="0.8"
            paintOrder="stroke"
          >
            {z.label}
          </text>
        </g>
      ))}
    </>
  );
}

/** Miniatura usada nos cards de mapa. */
export function MapThumb({ map, className }: { map: GameMap; className?: string }) {
  const main = map.radar?.layers[0];
  return (
    <svg viewBox="-4 -4 108 108" className={cn('pointer-events-none', className)} aria-hidden>
      {main ? (
        <path d={main.path} fillRule="evenodd" fill="rgb(255 255 255 / 0.07)" stroke="rgb(255 255 255 / 0.35)" strokeWidth="0.45" />
      ) : (
        map.layout?.zones.map((z) => <circle key={z.id} cx={z.x} cy={z.y} r="1.1" fill="rgb(255 255 255 / 0.28)" />)
      )}
      <Sites map={map} />
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
        <circle cx={x} cy={y} r="3.4" fill="rgb(200 208 218 / 0.3)" stroke={color} strokeWidth={active ? 0.7 : 0.35} />
      )}
      {u.type === 'MOLOTOV' && (
        <circle cx={x} cy={y} r="2.8" fill="rgb(240 135 79 / 0.32)" stroke={color} strokeWidth={active ? 0.7 : 0.35} />
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
  const uid = useId().replace(/:/g, '');
  const layers = map?.radar?.layers ?? [];

  return (
    <div className={cn('relative overflow-hidden rounded-[22px] bg-black/30 ring-1 ring-inset ring-white/[0.06]', className)}>
      <svg viewBox="0 0 100 100" className="block aspect-square w-full" role="img" aria-label={`Radar de ${map?.name ?? 'mapa'}`}>
        <Grid />
        {map && <Radar map={map} uid={uid} />}
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
              <circle cx={m.x} cy={m.y} r="2.2" fill="var(--color-ink)" stroke="#121519" strokeWidth="0.4" />
              <text x={m.x} y={m.y + 0.95} textAnchor="middle" fontSize="2.6" fontWeight="800" fill="#0b0d10">
                {m.label}
              </text>
            </motion.g>
          ))}
      </svg>
      {!hasLayout && <div className="absolute inset-0 grid place-items-center text-sm text-faint">Mapa visual em breve</div>}
      <div className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-faint backdrop-blur">
        {layers.length ? 'Radar Call CS' : 'Esquemático'}
      </div>
      {layers.length > 1 && (
        <div className="pointer-events-none absolute bottom-3 left-3 flex gap-3 rounded-full bg-black/50 px-3 py-1 text-[10px] font-semibold text-muted backdrop-blur">
          <span>━ {layers[0].label}</span>
          {layers.slice(1).map((l) => (
            <span key={l.id} className="text-accent">
              ┅ {l.label}
            </span>
          ))}
        </div>
      )}
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
