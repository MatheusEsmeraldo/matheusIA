import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/cn';
import { LogoMark } from '@/components/ui/Logo';
import { NAV_ITEMS, activeNavId } from './navItems';

/** Trilho de ícones à esquerda (tablet/desktop). */
export function Sidebar({ className }: { className?: string }) {
  const { pathname, search } = useLocation();
  const active = activeNavId(pathname, search);

  return (
    <aside className={cn('shrink-0 flex-col items-center p-3 lg:p-4', className)}>
      <div className="surface flex h-full w-[60px] flex-col items-center gap-2 rounded-[28px] py-3">
        <Link to="/" aria-label="Call CS — início" className="mb-3 grid size-11 place-items-center rounded-full text-ink">
          <LogoMark className="size-7" />
        </Link>
        <nav aria-label="Principal" className="flex flex-col items-center gap-1.5">
          {NAV_ITEMS.map((item) => {
            const isActive = active === item.id;
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                to={item.to()}
                aria-label={item.label}
                title={item.label}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'relative grid size-11 place-items-center rounded-full transition-colors',
                  isActive ? 'text-ink' : 'text-faint hover:text-muted',
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-full bg-white/[0.1] ring-1 ring-inset ring-white/[0.1]"
                    transition={{ type: 'spring', stiffness: 600, damping: 40 }}
                  />
                )}
                <Icon className="relative size-5" strokeWidth={1.9} />
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
