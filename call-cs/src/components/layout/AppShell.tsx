import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

/**
 * Casca do app.
 * - md+: moldura de vidro flutuante + trilho lateral (linguagem da referência visual).
 * - mobile: tela cheia, sem moldura, navegação via MobileMenu nas páginas.
 */
export function AppShell() {
  return (
    <div className="app-backdrop min-h-dvh md:h-dvh md:p-3 lg:p-5">
      <div className="flex min-h-dvh md:glass-frame md:h-full md:min-h-0 md:rounded-[var(--radius-frame)]">
        <Sidebar className="hidden md:flex" />
        <main id="main" className="min-w-0 flex-1 md:scroll-thin md:overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
