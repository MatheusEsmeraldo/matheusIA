import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { FavoritesProvider } from '@/hooks/FavoritesProvider';
import { AppShell } from '@/components/layout/AppShell';
import { ToastProvider } from '@/components/ui/Toast';
import { EncyclopediaPage } from '@/pages/EncyclopediaPage';
import { HomePage } from '@/pages/HomePage';
import { MatchPage } from '@/pages/MatchPage';

/**
 * Rotas (HashRouter: funciona em qualquer hospedagem estática, sem config de servidor).
 *   #/                    Entrada (selecionar mapa)
 *   #/partida/:mapId      Modo Partida
 *   #/enciclopedia        Enciclopédia  (?fav=1 → favoritas)
 *   ?call=<id>            Detalhe da call aberto por cima de qualquer tela
 */
export default function App() {
  return (
    <ToastProvider>
      <FavoritesProvider>
        <HashRouter>
          <Routes>
            <Route element={<AppShell />}>
              <Route index element={<HomePage />} />
              <Route path="partida" element={<MatchPage />} />
              <Route path="partida/:mapId" element={<MatchPage />} />
              <Route path="enciclopedia" element={<EncyclopediaPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </HashRouter>
      </FavoritesProvider>
    </ToastProvider>
  );
}
