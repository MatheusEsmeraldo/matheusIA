import { Menu } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/cn';
import { IconButton } from '@/components/ui/IconButton';
import { Logo } from '@/components/ui/Logo';
import { Overlay } from '@/components/ui/Overlay';
import { NAV_ITEMS, activeNavId } from './navItems';

/** Navegação mobile: um botão de menu que abre uma folha com os modos. */
export function MobileMenu({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const { pathname, search } = useLocation();
  const active = activeNavId(pathname, search);

  return (
    <>
      <IconButton label="Menu" variant="surface" onClick={() => setOpen(true)} className={className}>
        <Menu className="size-5" />
      </IconButton>
      <Overlay open={open} onClose={() => setOpen(false)} label="Menu">
        <div className="flex flex-col gap-4 p-5 pb-safe">
          <Logo className="text-lg" />
          <nav className="grid gap-2" aria-label="Principal">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  to={item.to()}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex h-14 items-center gap-3 rounded-2xl px-4 text-base font-semibold transition-colors',
                    active === item.id ? 'bg-ink text-[#0b0d10]' : 'surface text-ink',
                  )}
                >
                  <Icon className="size-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </Overlay>
    </>
  );
}
